import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-pink-400 to-purple-400 opacity-50 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1.1, 1.4, 1],
          rotate: [0, 90, 180, 270, 360],
          x: ["0%", "15%", "-15%", "10%", "-10%", "0%"],
          y: ["0%", "15%", "-15%", "10%", "-10%", "0%"],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-80 h-80 bg-gradient-to-br from-blue-400 to-green-400 opacity-50 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.4, 1.2, 1.5, 1],
          rotate: [0, -120, -240, -360],
          x: ["0%", "-15%", "15%", "-10%", "10%", "0%"],
          y: ["0%", "-15%", "15%", "-10%", "10%", "0%"],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
          times: [0, 0.2, 0.5, 0.8, 1],
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-br from-yellow-400 to-orange-400 opacity-50 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.5, 1.3, 1.6, 1],
          rotate: [0, 180, 360],
          x: ["0%", "10%", "-10%", "5%", "-5%", "0%"],
          y: ["0%", "10%", "-10%", "5%", "-5%", "0%"],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
          times: [0, 0.3, 0.6, 0.9, 1],
        }}
      />
    </div>
  );
}
