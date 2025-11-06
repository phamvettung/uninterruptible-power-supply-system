package com.tungpv.fx5_server.tcpsocket;

import java.io.*;
import java.net.Socket;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tungpv.fx5_server.dto.ws.DeviceData;
import com.tungpv.fx5_server.dto.ws.Energy;
import com.tungpv.fx5_server.websocket.WebSocketPublisher;

public class ClientHandler implements Runnable{
    private final String id;
    private final Socket socket;
    private final PrintWriter out;
    private final BlockingQueue<String> messageQueue = new LinkedBlockingQueue<>();
    BlockingQueue<byte[]> messageByteQueue = new LinkedBlockingQueue<>();
    ObjectMapper mapper = new ObjectMapper();

    public ClientHandler(String id, Socket socket) throws IOException {
        this.id = id;
        this.socket = socket;
        this.out = new PrintWriter(socket.getOutputStream(), true);
    }

    // Utility function to find a byte in an array
    private int indexOf(byte[] data, byte value, int start) {
        for (int i = start; i < data.length; i++) {
            if (data[i] == value) return i;
        }
        return -1;
    }

    @Override
    public void run() {
        try {
            socket.setSoTimeout(5000); // timeout for read()

            // Start message processor thread
            startMessageProcessor();

            final byte STX = 0x02;
            final byte ETX = 0x03;
            final int FRAME_LENGTH = 29;

            InputStream in = socket.getInputStream();
            ByteArrayOutputStream bufferStream = new ByteArrayOutputStream();

            byte[] buffer = new byte[1024];
            int len;

            while (true) {
                try {
                    len = in.read(buffer);
                    if (len == -1) {
                        // Client closed socket properly
                        System.out.println("Client disconnected (EOF): " + id);
                        break;
                    }

                    // Append received bytes to the accumulator
                    bufferStream.write(buffer, 0, len);
                    byte[] data = bufferStream.toByteArray();

                    int startIdx, endIdx;
                    int searchPos = 0;

                    while (true) {
                        startIdx = indexOf(data, STX, searchPos);
                        if (startIdx == -1) break;

                        // Check if we have a full frame yet
                        if (data.length - startIdx < FRAME_LENGTH) {
                            // not enough data yet, wait for next read
                            break;
                        }

                        endIdx = startIdx + FRAME_LENGTH - 1;
                        if (data[endIdx] != ETX) {
                            System.out.println("Invalid frame ending — ETX not found at expected position");
                            searchPos = startIdx + 1;
                            continue;
                        }

                        // Extract payload between STX and ETX
                        byte[] messageBytes = Arrays.copyOfRange(data, startIdx + 1, endIdx);
                        String messageString = new String(messageBytes, StandardCharsets.UTF_8);


                        // Enqueue the message
                        //messageQueue.offer(messageString);
                        messageByteQueue.offer(messageBytes);

                        // Move search position after ETX
                        searchPos = endIdx + 1;
                    }

                    // Keep leftover (unprocessed) bytes in bufferStream
                    if (searchPos > 0) {
                        byte[] remaining = Arrays.copyOfRange(data, searchPos, data.length);
                        bufferStream.reset();
                        bufferStream.write(remaining);
                    }


                } catch (java.net.SocketTimeoutException e) {
                    // No data received in timeout period → check if still connected
                    if (socket.isClosed() || !socket.isConnected()) {
                        System.out.println("Client appears disconnected: " + id);
                        break;
                    }
                    // else just continue to wait
                }
            }
        } catch (Exception e) {
            System.out.println("Client disconnected with error: " + id);
            e.printStackTrace();
        } finally {
            close();
        }
    }

    public static <T> T parseMessageByte(byte[] data, Class<T> clazz) throws Exception {

        if (clazz == DeviceData.class) {

            Energy energy = new Energy();
            energy.setCurrent(ByteBuffer.wrap(data, 9, 4).order(ByteOrder.LITTLE_ENDIAN).getFloat());
            energy.setVoltage(ByteBuffer.wrap(data, 13, 4).order(ByteOrder.LITTLE_ENDIAN).getFloat());
            energy.setPowerConsumption(ByteBuffer.wrap(data, 17, 4).order(ByteOrder.LITTLE_ENDIAN).getFloat());
            energy.setElectricConsumption(ByteBuffer.wrap(data, 21, 4).order(ByteOrder.LITTLE_ENDIAN).getFloat());
            energy.setStatus(ByteBuffer.wrap(data, 25, 2).order(ByteOrder.LITTLE_ENDIAN).getShort());

            DeviceData device = new DeviceData();
            device.setMessageType(new String(data, 1, 4, StandardCharsets.UTF_8));
            device.setDeviceId(ByteBuffer.wrap(data, 5, 2).order(ByteOrder.LITTLE_ENDIAN).getShort());
            device.setSequenceNumber(ByteBuffer.wrap(data, 7, 2).order(ByteOrder.LITTLE_ENDIAN).getShort());
            device.setData(energy);

            return clazz.cast(device);
        }

        throw new IllegalArgumentException("Unsupported message class: " + clazz.getName());
    }


    private void startMessageProcessor() {
        Thread processor = new Thread(() -> {
            try {
                while (!Thread.currentThread().isInterrupted()) {
                    // Take next message from queue (blocks if empty)
                    byte[] messageBytes = messageByteQueue.take();
                    try{
                        // business logic
                        // e.g. parse JSON, respond, store to DB, etc.
                        DeviceData data = parseMessageByte(messageBytes, DeviceData.class);
                        WebSocketPublisher.broadcast(data);
                    } catch (Exception e){
                        System.out.println("Failed on business logic: " + e.getMessage());
                    }
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });
        processor.setDaemon(true);
        processor.start();
    }

    public void sendMessageBytes(byte[] msg) throws IOException {
        OutputStream out = socket.getOutputStream();
        out.write(msg);
        out.flush();
    }

    public void sendMessage(String msg) {
        String frameMsg = "\u0002" + msg + "\u0003";
        out.print(frameMsg);
        out.flush();
    }

    public void close(){
        try {
            socket.close();
        } catch (Exception ignored) {}
    }
}
