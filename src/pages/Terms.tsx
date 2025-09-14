// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, CreditCard, Shield, AlertTriangle, Gavel } from "lucide-react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}
      
      {/* Hero Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <FileText className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h1 className="text-5xl font-bold mb-6">Terms of Service</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Please read these terms carefully before using VidyaSphere. 
              By accessing our platform, you agree to these terms and conditions.
            </p>
             <p className="text-xl text-muted-foreground leading-relaxed">
              vidyasphere own by shubham kumar 
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: August 2024
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Acceptance of Terms */}
            <Card className="card-shadow">
              {/* <CardHeader> */}
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-primary" />
                  Acceptance of Terms
                </CardTitle>
              {/* </CardHeader> */}
              <CardContent>
                <p className="text-muted-foreground">
                  By accessing and using VidyaSphere's website and services, you accept and agree 
                  to be bound by the terms and provision of this agreement. If you do not agree 
                  to abide by the above, please do not use this service.
                </p>
              </CardContent>
            </Card>

            {/* Platform Description */}
            <Card className="card-shadow">
              {/* <CardHeader> */}
                <CardTitle>Platform Description</CardTitle>
              {/* </CardHeader> */}
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  VidyaSphere is an educational platform providing:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Online courses and batches for Engineering, 10th, and 12th standards</li>
                  <li>• Study materials, notes, and previous year questions</li>
                  <li>• Attendance tracking tools</li>
                  <li>• Educational resources and community features</li>
                </ul>
              </CardContent>
            </Card>

            {/* User Accounts */}
            <Card className="card-shadow">
              {/* <CardHeader> */}
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  User Accounts
                </CardTitle>
              {/* </CardHeader> */}
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Account Creation</h3>
                  <p className="text-muted-foreground">
                    You must provide accurate and complete information when creating an account. 
                    You are responsible for maintaining the confidentiality of your account credentials.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Account Responsibilities</h3>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• You are responsible for all activities under your account</li>
                    <li>• Notify us immediately of any unauthorized use</li>
                    <li>• You must be at least 13 years old to create an account</li>
                    <li>• One account per person</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Course Enrollment & Payments */}
            <Card className="card-shadow">
              {/* <CardHeader> */}
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Course Enrollment & Payments
                </CardTitle>
              {/* </CardHeader> */}
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Enrollment</h3>
                  <p className="text-muted-foreground">
                    Course enrollment is subject to availability. Prices are subject to change 
                    without notice. All fees must be paid in advance.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Refund Policy</h3>
                  <p className="text-muted-foreground">
                    Refunds are not available .
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Payment Security</h3>
                  <p className="text-muted-foreground">
                    All payments are processed through secure pa  yment gateways. We do not store 
                    your payment information on our servers.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Content Usage */}
            <Card className="card-shadow">
              {/* <CardHeader> */}
                <CardTitle>Content Usage and Intellectual Property</CardTitle>
              {/* </CardHeader> */}
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Our Content</h3>
                  <p className="text-muted-foreground">
                    All content on VidyaSphere, including courses, materials, and resources, 
                    is protected by copyright and other intellectual property laws. You may not 
                    reproduce, distribute, or commercially use our content without permission.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">User-Generated Content</h3>
                  <p className="text-muted-foreground">
                    By uploading notes, PYQs, or other content, you grant us a non-exclusive, 
                    royalty-free license to use, display, and distribute your content on our platform. 
                    You warrant that you own the rights to the content you upload.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Attendance Tracking */}
            <Card className="card-shadow">
              {/* <CardHeader> */}
                <CardTitle>Attendance Tracking</CardTitle>
              {/* </CardHeader> */}
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Our attendance tracking feature operates as follows:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Data is stored locally on your device using browser storage</li>
                  <li>• We are not responsible for data loss due to browser issues or device problems</li>
                  <li>• Attendance can only be marked once per 24-hour period per subject</li>
                  <li>• The feature is provided "as-is" for educational purposes only</li>
                  <li>• We do not guarantee the accuracy of attendance calculations</li>
                </ul>
              </CardContent>
            </Card>

            {/* Prohibited Uses */}
            <Card className="card-shadow">
              {/* <CardHeader> */}
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Prohibited Uses
                </CardTitle>
              {/* </CardHeader> */}
              <CardContent>
                <p className="text-muted-foreground mb-4">You may not use our platform to:</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Violate any laws or regulations</li>
                  <li>• Share false or misleading information</li>
                  <li>• Upload copyrighted material without permission</li>
                  <li>• Attempt to hack or disrupt our services</li>
                  <li>• Create multiple accounts or share account credentials</li>
                  <li>• Use automated tools to access our platform</li>
                  <li>• Engage in any commercial activities without authorization</li>
                </ul>
              </CardContent>
            </Card>

            {/* Disclaimers */}
            <Card className="card-shadow">
              {/* <CardHeader> */}
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Disclaimers and Limitations
                </CardTitle>
              {/* </CardHeader> */}
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Educational Purpose</h3>
                  <p className="text-muted-foreground">
                    Our content is for educational purposes only. We do not guarantee specific 
                    academic results or exam success.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Service Availability</h3>
                  <p className="text-muted-foreground">
                    We strive to maintain service availability but do not guarantee uninterrupted 
                    access. We may suspend services for maintenance or updates.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Third-Party Content</h3>
                  <p className="text-muted-foreground">
                    We are not responsible for the accuracy or reliability of user-generated 
                    content or third-party materials shared on our platform.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card className="card-shadow">
              {/* <CardHeader> */}
                <CardTitle>Termination</CardTitle>
              {/* </CardHeader> */}
              <CardContent>
                <p className="text-muted-foreground">
                  We reserve the right to terminate or suspend your account immediately, without 
                  prior notice, for any reason, including breach of these terms. Upon termination, 
                  your right to use the service will cease immediately.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Terms */}
            <Card className="card-shadow">
              {/* <CardHeader> */}
                <CardTitle>Changes to Terms</CardTitle>
              {/* </CardHeader> */}
              <CardContent>
                <p className="text-muted-foreground">
                  We reserve the right to modify these terms at any time. We will notify users 
                  of any material changes by posting the updated terms on this page. Your continued 
                  use of the service after changes constitutes acceptance of the new terms.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="card-shadow">
              {/* <CardHeader> */}
                <CardTitle>Contact Information</CardTitle>
              {/* </CardHeader> */}
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  For questions about these Terms of Service, please contact us:
                </p>
                <div className="space-y-2 text-muted-foreground">
                  <p>Name: Shubham Kumar</p>
                  <p>Email: shubhammrdm394@gmail.com</p>
                  <p>Phone: +91 7667928057</p>
                  <p>Address: begusarai , bihar , india</p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  );
};

export default Terms;