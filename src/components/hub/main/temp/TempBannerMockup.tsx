"use client"

import { motion } from "framer-motion"
import DualMonitor from "@/components/ui/dual-monitor"
import IPad from "@/components/ui/ipad"
import Macbook from "@/components/ui/macbook"
import Iphone15Pro from "@/components/ui/iphone-15-pro"

const TempBannerMockup = () => {
  return (
    <section className="w-full bg-[#f3f3f3] py-12 md:py-16 lg:py-20">
      <div className="mx-auto flex w-full max-w-[1400px] items-end justify-center px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 1 }}
          animate={{ opacity: 1, y: 0, scale: 1.05 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative flex w-full origin-bottom items-end justify-center"
        >
          <div className="relative z-10 w-[84%] min-w-[480px] max-w-[1170px]">
            <DualMonitor
              width={940}
              height={400}
              srcLeft="/assets/products/trader-pro-left.png"
              srcRight="/assets/products/trader-pro-right.png"
              className="h-auto w-full"
            />
          </div>

          <div className="pointer-events-none absolute bottom-0 left-[20%] z-40 hidden w-[20%] min-w-[134px] max-w-[246px] md:block">
            <div className="origin-bottom-left -rotate-90">
              <IPad width={560} height={778} src="/assets/products/mobile-app.png" className="h-auto w-full" />
            </div>
          </div>

          <div className="relative z-30 -ml-20 w-[54%] min-w-[351px] max-w-[675px] md:-ml-24 lg:-ml-28">
            <Macbook width={680} height={390} src="/assets/products/web-portal.jpg" className="h-auto w-full" />
            <div className="absolute -bottom-1 right-0 z-50 w-[23%] min-w-[66px] max-w-[121px]">
              <Iphone15Pro width={433} height={882} src="/assets/products/iphone-app.png" className="h-auto w-full" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TempBannerMockup
