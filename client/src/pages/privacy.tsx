import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const sections = [
  {
    title: "Information We Collect",
    content: `When you create an account, we collect your name, email address, and password (stored securely as a hash). When you report a lost or found item, we collect the details you provide including title, description, category, location, date, contact information, and any images you upload. We do not collect payment information.`,
  },
  {
    title: "How We Use Your Information",
    content: `We use the information you provide solely to operate the Lost & Found platform — to display reported items to other users, to allow people to contact item reporters, and to show you your own reports on your dashboard. We do not sell, rent, or share your personal information with third parties for marketing purposes.`,
  },
  {
    title: "Image Uploads",
    content: `Images you upload are stored on our server and are publicly accessible to anyone visiting the platform. Please do not upload images containing sensitive personal information. We reserve the right to remove images that violate our Terms of Service.`,
  },
  {
    title: "Cookies & Sessions",
    content: `We use session cookies to keep you logged in. These cookies are essential for the platform to function and are not used for tracking or advertising. Sessions expire after 7 days of inactivity. You can clear cookies at any time through your browser settings, which will log you out.`,
  },
  {
    title: "Data Retention",
    content: `Your account and item reports are retained as long as your account is active. You may delete your reported items at any time from your Dashboard. To request full account deletion, please contact us and we will remove your data within 30 days.`,
  },
  {
    title: "Security",
    content: `Passwords are hashed using bcrypt and are never stored in plain text. All API routes that modify data require authentication. However, no system is completely secure — please use a strong, unique password and do not share your credentials with anyone.`,
  },
  {
    title: "Children's Privacy",
    content: `This platform is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.`,
  },
  {
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date. Continued use of the platform after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: "Contact Us",
    content: `If you have any questions about this Privacy Policy or how your data is handled, please reach out via our Contact page. We take your privacy seriously and will respond to all inquiries within 48 hours.`,
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-16">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-primary/10 rounded-xl">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-semibold text-primary">Legal</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Effective date: January 1, 2025</p>
            <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
              Your privacy matters to us. This policy explains what information we collect, how we use it, and the choices you have.
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
