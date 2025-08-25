'use client'
import Footer from '@/components/Footer';
import { StaticHeader } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import React from 'react';
import { ChevronsDownUp, ChevronsUpDown, Expand, ExpandIcon } from 'lucide-react';

const Page = () => {

  const accordionValues = [
    'intro',
    'terms',
    'copyright',
    'no-advice',
    'access',
    'indemnification',
    'third-party',
    'no-warranties',
    'no-liability',
    'governing-law',
  ];

  const [openItems, setOpenItems] = React.useState<string[]>([]);
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const handleExpandCollapse = () => {
    if (openItems.length === accordionValues.length) {
      setOpenItems([]);
    } else {
      setOpenItems(accordionValues);
    }
  };

  return (
    <div className='w-full flex flex-col'>
      <motion.div 
        className='flex-1 container mx-auto py-10 px-4 sm:px-6 lg:px-8'
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="w-full">
          <CardHeader className="space-y-2">
            <CardTitle className="text-4xl font-bold">Terms of Use Agreement and Disclosures</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            <Button
                variant="ghost"
                className='w-fit'
                onClick={handleExpandCollapse}
              >
              {openItems.length === accordionValues.length ? <ChevronsUpDown /> : <ChevronsDownUp />}
            </Button>

            <Accordion
              type="multiple"
              value={openItems}
              onValueChange={(values) => setOpenItems(values as string[])}
              className="w-full"
            >

              <AccordionItem value="intro">
                <AccordionTrigger className="text-lg font-semibold">Introduction</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p className="text-muted-foreground leading-relaxed">
                    AGM Technology (BVI) Inc., known as AGM Trader Broker & Advisor, is a company registered in the British Virgin Islands (BVI) under number 2045201 and is regulated by the BVI Financial Services Commission (BVIFSC). Its legal address is Commerce House, Wickhams Cay 1, Road Town, Tortola, British Virgin Islands, VG1110.
                  </p>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Customer accounts are held and securities are cleared through Interactive Brokers LLC (IBKR). Interactive Brokers LLC is a registered broker-dealer, member of the Commodity Futures Trading Commission (CFTC) and forex dealer, regulated by the U.S. Securities and Exchange Commission (SEC), the Commodity Futures Trading Commission (CFTC), and the National Futures Association (NFA), and is a member of the Financial Industry Regulatory Authority (FINRA) and various other self-regulatory organizations.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="terms">
                <AccordionTrigger className="text-lg font-semibold">Terms of Use Agreement</AccordionTrigger>
                <AccordionContent className="text-muted-foreground space-y-4">
                  <p>By browsing and/or using this website (www.agmtechnology.com) and/or any material, software, code, or service obtained on or from this website ("Site"), you agree to comply with the terms of these Terms of Use Agreement. If you do not agree with these terms, you must stop using the Site immediately.</p>
                  <p>YOU MAY NOT COPY, REPRODUCE, RECOMPILE, DECOMPILE, DISASSEMBLE, REVERSE ENGINEER, DISTRIBUTE, PUBLISH, DISPLAY, PERFORM, MODIFY, UPLOAD, CREATE DERIVATIVE WORKS FROM, TRANSMIT, OR EXPLOIT IN ANY WAY ALL OR ANY PART OF THE SITE.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="copyright">
                <AccordionTrigger className="text-lg font-semibold">Copyright</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p>Copyright © 1995-2021 General Shareholders' Meeting. All rights reserved. All text, images, graphics, animations, videos, music, sounds, software, code, and other materials on the Site are subject to the copyright and other intellectual property rights of AGM, its affiliated companies, and its licensors. AGM owns the copyright in the selection, coordination, and arrangement of the materials on this Site.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="no-advice">
                <AccordionTrigger className="text-lg font-semibold">No Advice</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p>The Content is intended solely for professionals in the financial markets and is not, nor should it be construed as, financial, legal, or other advice of any kind, nor should it be considered an offer or solicitation of an offer to buy, sell, or otherwise trade in any investment.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="access">
                <AccordionTrigger className="text-lg font-semibold">Access</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p>You acknowledge that the login access codes and passwords provided to you are for your exclusive use and may not be shared. You must ensure that your login access code and password are kept confidential.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="indemnification">
                <AccordionTrigger className="text-lg font-semibold">Indemnification</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p>You will indemnify, defend, and hold harmless AGM and its affiliates, directors, officers, agents, employees, successors, assigns, and all Data Providers from any claims, judgments, or proceedings brought by third parties against AGM arising from your use of this website and/or Content.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="third-party">
                <AccordionTrigger className="text-lg font-semibold">Third-Party Websites</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p>This Site may provide links to certain websites sponsored and maintained by AGM, as well as those sponsored or maintained by third parties. Such third-party websites are publicly available, and AGM provides access to such websites through this site solely for your convenience.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="no-warranties">
                <AccordionTrigger className="text-lg font-semibold">No Warranties</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p>THIS SITE AND THE INFORMATION AND MATERIAL IT CONTAINS ARE SUBJECT TO CHANGE AT ANY TIME BY AGM WITHOUT NOTICE. THIS SITE IS PROVIDED "AS IS" WITHOUT ANY WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="no-liability">
                <AccordionTrigger className="text-lg font-semibold">No Liability</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p>AGM and its directors, officers, employees, and agents shall have no liability for the accuracy, timeliness, completeness, reliability, performance, or continued availability of this Site.</p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="governing-law">
                <AccordionTrigger className="text-lg font-semibold">Governing Law</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  <p>Your access and use of this website are governed by and will be construed in accordance with the laws of the British Virgin Islands, without regard to the conflict of laws principles of other jurisdictions.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Page;