import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Code, 
  Shield, 
  GraduationCap, 
  Heart,
  Users,
  Target,
  Award
} from "lucide-react";

const About = () => {
  const teamValues = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To make quality education accessible to every student across India, regardless of their location or financial constraints."
    },
    {
      icon: Heart,
      title: "Our Passion",
      description: "We believe in the transformative power of education and are committed to helping students achieve their academic goals."
    },
    {
      icon: Users,
      title: "Our Community",
      description: "Building a supportive learning community where students can learn, share, and grow together."
    },
    {
      icon: Award,
      title: "Our Quality",
      description: "Maintaining the highest standards in educational content and ensuring every resource adds value to your learning journey."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">About VidyaSphere</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              VidyaSphere is more than just an educational platform - it's a dream turned into reality 
              by four passionate flatmates who believe in the power of accessible, quality education.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Meet the Founder</h2>
              <p className="text-xl text-muted-foreground">The visionary behind VidyaSphere</p>
            </div>
            
            <Card className="card-shadow max-w-4xl mx-auto">
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="h-12 w-12 text-white" />
                </div>
                <CardTitle className="text-3xl text-gradient">Shubham Kumar</CardTitle>
                <CardDescription className="text-lg">
                  Founder & Lead Developer
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  A passionate software engineer and cybersecurity specialist from Government Engineering College, Kishanganj. 
                  Shubham's journey in technology and education led him to create VidyaSphere as a solution to bridge 
                  the gap between quality education and accessibility.
                </p>
                
                <div className="flex flex-wrap justify-center gap-3">
                  <Badge className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Software Engineer
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Cybersecurity Specialist
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Educational Technology
                  </Badge>
                </div>

                <div className="bg-muted/50 p-6 rounded-lg">
                  <blockquote className="text-lg italic text-muted-foreground">
                    "Education should not be a privilege but a right. Through VidyaSphere, we aim to democratize 
                    learning and ensure every student has access to quality educational resources, regardless of 
                    their background or circumstances."
                  </blockquote>
                  <cite className="block mt-4 text-sm font-semibold">- Shubham Kumar</cite>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Story Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Our Story</h2>
              <p className="text-xl text-muted-foreground">From flatmates to co-founders</p>
            </div>
            
            <Card className="card-shadow">
              <CardContent className="p-8">
                <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                  <p>
                    VidyaSphere was born out of a shared vision among four flatmates during their college years at 
                    Government Engineering College, Kishanganj. What started as late-night discussions about the 
                    challenges in accessing quality educational resources soon transformed into a concrete plan 
                    to make a difference.
                  </p>
                  
                  <p>
                    Recognizing the struggles that students face in finding comprehensive study materials, 
                    previous year questions, and quality guidance for Engineering, 10th, and 12th standards, 
                    our team decided to create a platform that would serve as a one-stop solution for all 
                    educational needs.
                  </p>
                  
                  <p>
                    Each team member brought their unique skills and perspectives to the table - from technical 
                    development to educational content curation, from user experience design to community building. 
                    Together, they worked tirelessly to bring VidyaSphere to life.
                  </p>
                  
                  <p>
                    Today, VidyaSphere stands as a testament to what passionate individuals can achieve when 
                    they work together towards a common goal - making education accessible, affordable, and 
                    effective for students across India.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground">What drives us every day</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {teamValues.map((value, index) => (
              <Card key={index} className="card-shadow hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                    <value.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Get in Touch</h2>
            <p className="text-xl text-muted-foreground">
              Have questions or want to connect? We'd love to hear from you.
            </p>
          </div>
          
          <Card className="max-w-2xl mx-auto card-shadow">
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Email</h3>
                  <p className="text-muted-foreground">shubhammrdm394@gmail.com</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Location</h3>
                  <p className="text-muted-foreground">Government Engineering College, Kishanganj</p>
                </div>
                <div className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    We're always open to feedback, suggestions, and collaborations that can help us 
                    improve the educational experience for students.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default About;
