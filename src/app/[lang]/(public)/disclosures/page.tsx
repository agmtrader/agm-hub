'use client'
import Footer from '@/components/hub/Footer';
import { StaticHeader } from '@/components/hub/Header';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import DashboardPage from '@/components/misc/DashboardPage';

const Page = () => {

  // Accordion removed – no local state needed anymore.
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

  return (
    <div className='w-full h-full flex flex-col gap-2 px-10'>
      <div className='w-full h-full flex flex-col gap-2'>
        <h1 className='text-4xl font-bold'>Terms of Use, Policies & Disclosures</h1>
        <p className='text-foreground'>Explore all regulation we follow</p>
      </div>
      <Tabs defaultValue="terms" className="w-full">
        {/* Tab Triggers */}
        <TabsList className="mb-4">
          <TabsTrigger value="terms">Terms & Disclosures</TabsTrigger>
          <TabsTrigger value="cyber">Cyber Security Policy</TabsTrigger>
          <TabsTrigger value="privacy">Data Privacy Policy</TabsTrigger>
        </TabsList>

        {/* Terms & Disclosures */}
        <TabsContent value="terms" className="w-full">
          <Card className="w-full">
            <CardContent className="space-y-6">

              {/* Disclosures – Accordion replaced by static sections */}

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  AGM Technology (BVI) Inc., known as AGM Trader Broker & Advisor, is a company registered in the British Virgin Islands (BVI) under number 2045201 and is regulated by the BVI Financial Services Commission (BVIFSC). Its legal address is Commerce House, Wickhams Cay 1, Road Town, Tortola, British Virgin Islands, VG1110.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Customer accounts are held and securities are cleared through Interactive Brokers LLC (IBKR). Interactive Brokers LLC is a registered broker-dealer, member of the Commodity Futures Trading Commission (CFTC) and forex dealer, regulated by the U.S. Securities and Exchange Commission (SEC), the Commodity Futures Trading Commission (CFTC), and the National Futures Association (NFA), and is a member of the Financial Industry Regulatory Authority (FINRA) and various other self-regulatory organizations.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Terms of Use Agreement</h2>
                <p>By browsing and/or using this website (www.agmtechnology.com) and/or any material, software, code, or service obtained on or from this website ("Site"), you agree to comply with the terms of these Terms of Use Agreement. If you do not agree with these terms, you must stop using the Site immediately.</p>
                <p>YOU MAY NOT COPY, REPRODUCE, RECOMPILE, DECOMPILE, DISASSEMBLE, REVERSE ENGINEER, DISTRIBUTE, PUBLISH, DISPLAY, PERFORM, MODIFY, UPLOAD, CREATE DERIVATIVE WORKS FROM, TRANSMIT, OR EXPLOIT IN ANY WAY ALL OR ANY PART OF THE SITE.</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Copyright</h2>
                <p>Copyright © 1995-2021 General Shareholders' Meeting. All rights reserved. All text, images, graphics, animations, videos, music, sounds, software, code, and other materials on the Site are subject to the copyright and other intellectual property rights of AGM, its affiliated companies, and its licensors. AGM owns the copyright in the selection, coordination, and arrangement of the materials on this Site.</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">No Advice</h2>
                <p>The Content is intended solely for professionals in the financial markets and is not, nor should it be construed as, financial, legal, or other advice of any kind, nor should it be considered an offer or solicitation of an offer to buy, sell, or otherwise trade in any investment.</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Access</h2>
                <p>You acknowledge that the login access codes and passwords provided to you are for your exclusive use and may not be shared. You must ensure that your login access code and password are kept confidential.</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Indemnification</h2>
                <p>You will indemnify, defend, and hold harmless AGM and its affiliates, directors, officers, agents, employees, successors, assigns, and all Data Providers from any claims, judgments, or proceedings brought by third parties against AGM arising from your use of this website and/or Content.</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Third-Party Websites</h2>
                <p>This Site may provide links to certain websites sponsored and maintained by AGM, as well as those sponsored or maintained by third parties. Such third-party websites are publicly available, and AGM provides access to such websites through this site solely for your convenience.</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">No Warranties</h2>
                <p>THIS SITE AND THE INFORMATION AND MATERIAL IT CONTAINS ARE SUBJECT TO CHANGE AT ANY TIME BY AGM WITHOUT NOTICE. THIS SITE IS PROVIDED "AS IS" WITHOUT ANY WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">No Liability</h2>
                <p>AGM and its directors, officers, employees, and agents shall have no liability for the accuracy, timeliness, completeness, reliability, performance, or continued availability of this Site.</p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Governing Law</h2>
                <p>Your access and use of this website are governed by and will be construed in accordance with the laws of the British Virgin Islands, without regard to the conflict of laws principles of other jurisdictions.</p>
              </section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cyber Security Policy */}
        <TabsContent value="cyber" className="w-full">
          <Card className="w-full">
            <CardContent className="space-y-8">
              {/* Policy Brief & Purpose */}
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Policy Brief & Purpose</h2>
                <p>
                  This Cyber Security Policy outlines AGM Technology (BVI) Inc.'s guidelines and provisions for preserving the security of our data and technology infrastructure. As an introducing firm that facilitates brokerage accounts through Interactive Brokers LLC (IBKR), we collect, store, and manage sensitive client financial and identification information. This makes us particularly vulnerable to security breaches, which can result from human errors, malicious attacks, or system malfunctions. Such incidents pose significant risks, including severe financial damage and jeopardizing our company's reputation and compliance standing, especially concerning Common Reporting Standard (CRS) and Anti-Money Laundering (AML) obligations.
                </p>
                <p>
                  For these reasons, AGM Technology (BVI) Inc. has implemented a comprehensive set of security measures and prepared clear instructions to mitigate cyber security risks. This policy details both our proactive provisions and the protective measures in place.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Scope</h2>
                <p>
                  This policy applies to all AGM Technology (BVI) Inc. employees, contractors, volunteers, and anyone who has permanent or temporary access to our systems, networks, and hardware, whether on-site at our offices in Escazu Village, Costa Rica, or remotely. It covers all company-owned devices, as well as personal devices used for business purposes.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Policy Elements</h2>
              </section>

              <section className="space-y-4">
                <h3 className="text-xl font-semibold">Confidential Data</h3>
                <p>Confidential data at AGM Technology (BVI) Inc. is secret and valuable, and its protection is paramount. Common examples include:</p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>Unpublished Financial Information: Internal financial reports, investment strategies, and proprietary trading data.</li>
                  <li>Client Data: All Personally Identifiable Information (PII), financial records, tax residency details (critical for CRS compliance), account numbers, and transaction histories. This includes any sensitive data received from Interactive Brokers LLC (IBKR) or collected during our customer identification program (AML).</li>
                  <li>Partner/Vendor Data: Confidential information pertaining to our clearing firm (IBKR) and other service providers.</li>
                  <li>Proprietary Information: Any patents, unique methodologies, new technologies, or business development plans.</li>
                  <li>Customer Lists: Existing and prospective client lists.</li>
                </ul>
                <p>All individuals subject to this policy are obligated to protect this data. This policy provides instructions on how to avoid security breaches related to this confidential information.</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-xl font-semibold">Protect Personal and Company Devices</h3>
                <p>When employees use their digital devices to access AGM Technology (BVI) Inc.'s accounts and systems, whether company-issued or personal, strict security protocols apply:</p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>Device Security: All devices used to access company data must be password-protected with strong, unique passwords or biometric authentication. Devices should be configured for automatic screen lock after a short period of inactivity.</li>
                  <li>Software Updates: Operating systems, antivirus software, and all applications must be kept up-to-date with the latest security patches.</li>
                  <li>Antivirus Software: All devices must have approved antivirus/anti-malware software installed and actively running, with regular scans scheduled.</li>
                  <li>Physical Security: Devices should never be left unattended in public places. When working remotely, devices must be secured within a private and secure environment.</li>
                  <li>No Unauthorized Software: Employees shall not install unauthorized software on company devices or access company networks from devices with unapproved software.</li>
                  <li>Use of Virtual Private Networks (VPNs): When accessing AGM's systems from outside the corporate network, a secure VPN connection must always be used.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h3 className="text-xl font-semibold">Email and Internet Use</h3>
                <p>Email and internet are essential communication tools, but they also represent significant security vulnerabilities:</p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>Email Security: Employees must exercise extreme caution with emails from unknown senders or unexpected attachments. Phishing attempts should be reported immediately to the Compliance Officer, Cristian Ramirez. Do not click on suspicious links or download unverified attachments.</li>
                  <li>Strong Passwords: All company email accounts and online services must be protected by strong, unique passwords, and multi-factor authentication (MFA) must be enabled wherever possible.</li>
                  <li>Internet Browsing: Access to malicious or unauthorized websites is prohibited. Employees should avoid downloading files from untrusted sources.</li>
                  <li>Sensitive Information via Email: Avoid sending highly confidential client data (especially CRS or AML-related PII) via unencrypted email. Use secure file transfer methods or encrypted communications when dealing with sensitive information, particularly when communicating with clients or IBKR.</li>
                  <li>Cloud Services: Use of unauthorized cloud storage or collaboration services for company data is prohibited. Only approved, secure cloud platforms may be used.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h3 className="text-xl font-semibold">Networks and Servers</h3>
                <p>The security of AGM Technology (BVI) Inc.'s networks and servers, which underpin all operations, is critical:</p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>Access Control: Access to network infrastructure and servers is strictly controlled and limited to authorized IT and operations personnel. Access privileges are granted based on the principle of least privilege.</li>
                  <li>Network Security: Firewalls, intrusion detection/prevention systems, and other network security technologies are deployed and regularly monitored to protect against external threats.</li>
                  <li>Regular Audits: Network and server security configurations are regularly audited and tested for vulnerabilities by external security specialists.</li>
                  <li>Data Backup: Critical company data, including client records and compliance documentation, is regularly backed up to secure, off-site locations as detailed in our Business Continuity Plan (BCP) and CRS Policies & Procedures.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h3 className="text-xl font-semibold">Incident Response</h3>
                <p>Despite preventative measures, security incidents may occur. AGM Technology (BVI) Inc. has an incident response plan to address these events:</p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>Reporting Incidents: Any actual or suspected cyber security incident (e.g., data breach, unauthorized access, malware infection, loss/theft of a device) must be reported immediately to the Compliance Officer, Cristian Ramirez, and the CEO, Hernan Castro.</li>
                  <li>Investigation: All reported incidents will be promptly investigated by the Compliance Officer and relevant IT support, to determine the scope, cause, and impact.</li>
                  <li>Containment & Recovery: Steps will be taken to contain the incident, eradicate the threat, and restore affected systems and data from secure backups.</li>
                  <li>Notification: In the event of a data breach involving client information, affected individuals and regulatory authorities (including the BVI ITA for CRS-related data) will be notified as required by applicable laws and regulations.</li>
                  <li>Post-Incident Review: After an incident is resolved, a review will be conducted to identify lessons learned and implement improvements to prevent future occurrences.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h3 className="text-xl font-semibold">Software Restrictions</h3>
                <p>To maintain security and operational integrity, AGM Technology (BVI) Inc. enforces software restrictions:</p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>Approved Software Only: Only software that has been explicitly approved, licensed, and installed by authorized IT personnel may be used on company devices or accessed via company networks.</li>
                  <li>No Pirated Software: The use or installation of pirated, unlicensed, or illegally obtained software is strictly prohibited.</li>
                  <li>Regular Audits: Software installed on company devices will be periodically audited to ensure compliance with this policy.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h3 className="text-xl font-semibold">Remote Employees</h3>
                <p>Remote employees are integral to AGM Technology (BVI) Inc.'s operations and must adhere to this policy with particular diligence:</p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>Remote employees must follow all instructions within this policy.</li>
                  <li>Since remote employees access our company's accounts and systems from a distance, they are obligated to follow all data encryption, protection standards, and settings, and ensure their private network is secure.</li>
                  <li>This includes securing their home Wi-Fi networks with strong passwords and encryption (e.g., WPA2/WPA3), using VPNs for all company-related access, and ensuring their personal devices used for work are adequately protected with antivirus and updated software.</li>
                  <li>They are encouraged to seek advice from our Compliance Officer, Cristian Ramirez, for any security-related concerns or questions.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h3 className="text-xl font-semibold">Disciplinary Action</h3>
                <p>AGM Technology (BVI) Inc. expects all its employees to always follow this policy. Those who cause security breaches or disregard security instructions may face disciplinary action:</p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>First-time, unintentional, small-scale security breach: We may issue a verbal warning and provide additional training on security protocols.</li>
                  <li>Intentional, repeated, or large-scale breaches (which cause severe financial or other damage): We will invoke more severe disciplinary action, up to and including termination of employment. Each incident will be examined on a case-by-case basis.</li>
                  <li>Additionally, employees who are observed to disregard our security instructions will face progressive discipline, even if their behavior has not resulted in a security breach.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h3 className="text-xl font-semibold">Take Security Seriously</h3>
                <p>
                  Everyone, from our clients and partners (including Interactive Brokers LLC) to our employees and contractors, should feel that their data is safe with AGM Technology (BVI) Inc. The only way to gain and maintain this trust is to proactively protect our systems and databases. We can all contribute to this by being vigilant, continuously educated on security best practices, and keeping cyber security top of mind in all our daily operations.
                </p>
              </section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Privacy Policy */}
        <TabsContent value="privacy" className="w-full">
          <Card className="w-full">
            <CardContent className="space-y-8">

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Introduction and Purpose</h2>
                <p>
                  At AGM, we recognize that the confidentiality and security of the personal information that you share with us is of paramount importance. Our commitment is to protect the privacy of all Personal Information, including that of our clients, employees, agents, job applicants, and other third parties, both inside and outside of AGM. This policy is intended to summarize AGM's data protection practices and to inform all relevant parties about our privacy policies. By utilizing our products, services, and applications, you consent to the collection, use, and disclosure of your Personal Information in accordance with this policy.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Scope</h2>
                <p>
                  This manual applies to all AGM employees, contractors, volunteers, and any other individual who has permanent or temporary access to our systems and data. It provides the framework for our procedures and protocols related to the handling of Personal Information.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Who is Responsible for Your Personal Information?</h2>
                <p>
                  AGM Technology (BVI) Inc. is the entity responsible for the Personal Information that it collects, processes, and stores. The Compliance Officer, Cristian Ramirez, is the designated privacy officer responsible for overseeing the implementation and enforcement of this policy.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Collection and Use of Personal Information</h2>
                <p>
                  We collect Personal Information to provide our services, meet regulatory requirements, and operate our business effectively. The types of information we may collect include, but are not limited to:
                </p>
                <ul className="list-disc ml-5 space-y-2">
                  <li><strong>Personally Identifiable Information (PII):</strong> Name, address, date of birth, nationality, and Taxpayer Identification Number (TIN).</li>
                  <li><strong>Contact Information:</strong> Email address, phone number, and physical address.</li>
                  <li><strong>Financial Data:</strong> Bank account details, transaction history, and investment portfolio information.</li>
                  <li><strong>Due Diligence Information:</strong> Documents related to identity verification and source of wealth.</li>
                </ul>
                <p>
                  This information is collected from various sources, including client account applications, self-certification forms, and ongoing business interactions. It is used to:
                </p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>Establish and verify client identity in accordance with Anti-Money Laundering (AML) and Common Reporting Standard (CRS) regulations.</li>
                  <li>Process transactions and provide brokerage services.</li>
                  <li>Fulfill our regulatory reporting obligations to authorities like the International Tax Authority (ITA).</li>
                  <li>Communicate with clients regarding their accounts and services.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Disclosure of Personal Information</h2>
                <p>
                  We do not sell or rent Personal Information to third parties. Information may be disclosed to:
                </p>
                <ul className="list-disc ml-5 space-y-2">
                  <li>Regulatory and governmental bodies as required by law (e.g., for CRS reporting).</li>
                  <li>Third-party service providers who assist us in our business operations (e.g., our clearing firm, Interactive Brokers LLC).</li>
                  <li>Legal and professional advisors to protect our rights or respond to legal processes.</li>
                </ul>
                <p>
                  Any third-party provider we use must adhere to strict data protection standards and is only permitted to use the information for the specific purposes for which it was provided.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Data Security and Protection</h2>
                <p>
                  AGM is committed to protecting all Personal Information from unauthorized access, loss, misuse, or alteration. We have implemented technical, physical, and administrative safeguards to ensure data security.
                </p>
                <ul className="list-disc ml-5 space-y-2">
                  <li><strong>Technical Safeguards:</strong> We use encryption for all data in transit and at rest, and employ strong access controls to restrict data access to authorized personnel only.</li>
                  <li><strong>Physical Safeguards:</strong> All physical records are stored in secure locations with restricted access.</li>
                  <li><strong>Administrative Safeguards:</strong> Our employees receive regular training on data privacy protocols and are required to comply with our comprehensive Cyber Security Policy and Code of Ethics.</li>
                </ul>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Your Rights and Choices</h2>
                <p>
                  You have certain rights regarding your Personal Information. You may request access to your data, ask for corrections, or inquire about its use. We will consider all requests and provide a timely response in accordance with applicable laws. Please note that we may need to verify your identity before fulfilling a request to protect your information and prevent unauthorized disclosure.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">Updates to this Privacy Policy</h2>
                <p>
                  This policy is subject to change. We reserve the right to update or modify this policy from time to time to reflect changes in our practices or legal requirements. Any changes will be posted on our website or published otherwise and will take effect as soon as they are posted.
                </p>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold">How to Contact Us</h2>
                <p>
                  We welcome your feedback and questions about our Privacy Policy. If you have any questions, please contact us at info@agmtechnology.com.
                </p>
              </section>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;