// src/pages/Index.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Users, 
  Award, 
  Calculator, 
  Upload,
  Target,
  Phone,
  Mail,
  MessageSquare
} from "lucide-react";

const Index = () => {
  const features = [
    { icon: BookOpen, title: "Comprehensive Notes", description: "Access detailed notes for Engineering, 10th, and 12th classes", color: "bg-blue-100 text-blue-600" },
    { icon: Target, title: "Previous Year Questions", description: "Practice with extensive PYQ collection for better preparation", color: "bg-green-100 text-green-600" },
    { icon: Users, title: "Expert Batches", description: "Join specialized batches with experienced instructors", color: "bg-purple-100 text-purple-600" },
    { icon: Calculator, title: "Attendance Tracker", description: "Track your attendance and maintain 75% requirement", color: "bg-orange-100 text-orange-600" },
    { icon: Upload, title: "Upload Content", description: "Share your notes and PYQs with the community", color: "bg-pink-100 text-pink-600" },
    { icon: Award, title: "Quality Education", description: "Get quality education from experienced professionals", color: "bg-indigo-100 text-indigo-600" }
  ];

  const batches = [
    { title: "JEE Main Preparation", description: "Complete preparation for JEE Main with mock tests", price: "₹2,999", duration: "6 months", level: "Engineering" },
    { title: "Class 12th Board Prep", description: "Comprehensive Class 12 board exam preparation", price: "₹1,999", duration: "4 months", level: "12th Grade" },
    { title: "Class 10th Excellence", description: "Score high in Class 10 board examinations", price: "₹1,499", duration: "3 months", level: "10th Grade" }
  ];

  return (
    <div className="bg-background">
      
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 hero-gradient">
          <div className="educational-pattern opacity-20"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Welcome to <span className="text-yellow-300">VidyaSphere</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Your comprehensive platform for Engineering, 10th, and 12th education. 
            Learn, grow, and excel with our expert guidance and comprehensive resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100" asChild>
              <Link to="/batches">Explore Batches</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary" asChild>
              <Link to="/notes">Browse Notes</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose VidyaSphere?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide everything you need for academic success in one comprehensive platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-shadow hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Batches Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Popular Batches</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our top-rated batches and boost your preparation effectively
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {batches.map((batch, index) => (
              <Card key={index} className="card-shadow hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{batch.title}</CardTitle>
                  <Badge className="mt-2">{batch.level}</Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{batch.description}</CardDescription>
                  <p className="font-bold text-lg">{batch.price}</p>
                  <p className="text-muted-foreground">Duration: {batch.duration}</p>
                  <Button className="mt-4 w-full" asChild>
                    <Link to="/enroll">Enroll Now</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Have questions? We’d love to hear from you.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Card className="p-6 flex items-center gap-4">
              <Phone className="h-6 w-6 text-primary" />
              <span>+91 98765 43210</span>
            </Card>
            <Card className="p-6 flex items-center gap-4">
              <Mail className="h-6 w-6 text-primary" />
              <span>support@vidyasphere.com</span>
            </Card>
            <Card className="p-6 flex items-center gap-4">
              <MessageSquare className="h-6 w-6 text-primary" />
              <span>Live Chat Support</span>
            </Card>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Index;
