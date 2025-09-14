import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, Database, Share, Phone, CreditCard } from "lucide-react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Shield className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Your privacy is important to us. This policy explains how VidyaSphere collects, 
              uses, and protects your personal information.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: January 2024
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Information We Collect */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Personal Information</h3>
                  <p className="text-muted-foreground">
                    We collect information you provide directly, such as your name, email address, 
                    phone number, and educational details when you create an account or enroll in courses.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Usage Information</h3>
                  <p className="text-muted-foreground">
                    We automatically collect information about how you use our platform, including 
                    pages visited, time spent, and features used to improve our services.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Attendance Data</h3>
                  <p className="text-muted-foreground">
                    Attendance tracking data is stored locally on your device using browser storage. 
                    This data is not transmitted to or stored on our servers.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Information */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Provide and maintain our educational services</li>
                  <li>• Process enrollments and payments</li>
                  <li>• Send important updates about courses and platform changes</li>
                  <li>• Provide customer support and respond to inquiries</li>
                  <li>• Improve our platform based on usage patterns</li>
                  <li>• Ensure platform security and prevent fraud</li>
                </ul>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share className="h-5 w-5 text-primary" />
                  Information Sharing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  We do not sell, trade, or rent your personal information to third parties. 
                  We may share your information only in the following circumstances:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• With your explicit consent</li>
                  <li>• To comply with legal obligations</li>
                  <li>• To protect our rights and safety</li>
                  <li>• With trusted service providers who assist in platform operations</li>
                </ul>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We implement appropriate technical and organizational measures to protect your 
                  personal information against unauthorized access, alteration, disclosure, or destruction. 
                  However, no internet transmission is completely secure, and we cannot guarantee 
                  absolute security.
                </p>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Your Rights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">You have the right to:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Access your personal information</li>
                  <li>• Correct inaccurate information</li>
                  <li>• Delete your account and associated data</li>
                  <li>• Opt-out of marketing communications</li>
                  <li>• Data portability (receive a copy of your data)</li>
                </ul>
              </CardContent>
            </Card>

            {/* Local Storage */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle>Local Storage & Attendance Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our attendance tracking feature stores data locally on your device using browser 
                  storage technology. This means:
                </p>
                <ul className="space-y-2 text-muted-foreground mt-4">
                  <li>• Data remains on your device and is not sent to our servers</li>
                  <li>• You have full control over this data</li>
                  <li>• Clearing your browser data will remove attendance records</li>
                  <li>• We are not responsible for data loss due to browser issues</li>
                </ul>
              </CardContent>
            </Card>

            {/* Refund Policy */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Refund Policy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 font-semibold">
                  No Refund Policy
                </p>
                <p className="text-muted-foreground">
                  All payments made for courses, batches, or any services on VidyaSphere are final 
                  and non-refundable. We do not provide refunds under any circumstances.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-muted-foreground">
                  <p>Name: Shubham Kumar</p>
                  <p>Email: shubhammrdm394@gmail.com</p>
                  <p>Phone: +91 7667928057</p>
                  <p>Address: Begusarai, Bihar, India</p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Privacy;
