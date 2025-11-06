import React from 'react'
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";

export default function Pump({ isRunning }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        animate={{ rotate: isRunning ? 360 : 0 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <RotateCcw size={40} className={isRunning ? "text-green-400" : "text-gray-400"} />
      </motion.div>
      <span className="text-xs mt-1">{isRunning ? "RUNNING" : "STOP"}</span>
    </div>
  )
}
