import { motion } from "framer-motion";
import { ScrollText } from "lucide-react";

const sections = [
  {
    title: "Acceptance of Terms",
    content: `By accessing or using the Lost & Found platform ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. We reserve the right to update these terms at any time, and continued use of the Service constitutes acceptance of any changes.`,
  },
  {
    title: "User Accounts",
    content: `You must create an account to report lost or found items. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate information when registering. Accounts are for individual use only and may not be shared or transferred.`,
  },
  {
    title: "Acceptable Use",
    content: `You agree to use the Service only for its intended purpose — reporting genuinely lost or found items and connecting with others to reunite belongings. You must not post false, misleading, or fraudulent listings. You must not use the platform to scam, harass, or deceive other users. You must not attempt to gain unauthorised access to any part of the platform.`,
  },
  {
    title: "Content You Post",
    content: `You retain ownership of the content you post (descriptions, images, contact details). By posting content, you grant us a non-exclusive licence to display and store that content as part of operating the Service. You are solely responsible for the accuracy and legality of the content you post. We reserve the right to remove any content that violates these terms without notice.`,
  },
  {
    title: "Item Claims & Disputes",
    content: `The Lost & Found platform is a communication tool only. We do not verify the ownership of items, mediate disputes between users, guarantee the return of items, or have any involvement in physical transactions or handovers. All interactions between users regarding item recovery are solely between those parties.`,
  },
  {
    title: "Privacy",
    content: `Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Service you also agree to the Privacy Policy.`,
  },
  {
    title: "Prohibited Activities",
    content: `You may not: post items that are illegal to possess or transfer; use the platform for commercial advertising; scrape, crawl, or otherwise extract data from the platform in bulk; attempt to reverse-engineer or interfere with the platform's systems; impersonate any person or organisation; or use automated tools to create accounts or post listings.`,
  },
  {
    title: "Termination",
    content: `We reserve the right to suspend or permanently terminate your account at our discretion if you violate these Terms of Service, engage in abusive behaviour, or use the platform in a way that harms other users or the integrity of the Service. You may also delete your account at any time by contacting us.`,
  },
  {
    title: "Limitation of Liability",
    content: `The Service is provided "as is" without warranties of any kind. We are not liable for any loss or damage arising from your use of the Service, including loss of belongings, failed reunions, or disputes between users. Our total liability to you for any claim arising from these terms shall not exceed the amount you have paid us (if any).`,
  },
  {
    title: "Governing Law",
    content: `These Terms of Service are governed by the laws of India. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts of Chennai, Tamil Nadu, India.`,
  },
  {
    title: "Contact",
    content: `If you have questions about these Terms of Service, please contact us through our Contact page. We are happy to clarify anything and will respond within 48 hours.`,
  },
];

export default function Terms() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <ScrollText className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-semibold text-primary">Legal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Effective date: January 1, 2025</p>
            <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
              Please read these terms carefully before using the Lost & Found platform. They set out your rights and responsibilities as a user.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24 max-w-3xl">
        <div className="space-y-10">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="border-b pb-10 last:border-0"
            >
              <h2 className="text-xl font-bold mb-3">{i + 1}. {section.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{section.content}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
