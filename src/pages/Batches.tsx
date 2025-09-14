import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { 
  Clock, 
  Users, 
  Award, 
  BookOpen, 
  Video,
  FileText,
  CheckCircle,
  Star
} from "lucide-react";

const Batches = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // All Engineering Branches offered at BEU
  const engineeringBranches = [
    { code: "CE", name: "Civil Engineering", seats: 60 },
    { code: "ME", name: "Mechanical Engineering", seats: 60 },
    { code: "EE", name: "Electrical Engineering", seats: 60 },
    { code: "ECE", name: "Electronics & Communication Engineering", seats: 60 },
    { code: "CSE", name: "Computer Science & Engineering", seats: 120 },
    { code: "IT", name: "Information Technology", seats: 60 },
    { code: "CHE", name: "Chemical Engineering", seats: 30 },
    { code: "BT", name: "Biotechnology", seats: 30 },
    { code: "AE", name: "Aeronautical Engineering", seats: 30 },
    { code: "EN", name: "Environmental Engineering", seats: 30 },
    { code: "PE", name: "Production Engineering", seats: 30 },
    { code: "IE", name: "Industrial Engineering", seats: 30 },
  ];

  const batches = [
    {
      id: 1,
      title: "1st Semester - Foundation Engineering (All Branches)",
      description: "Complete coverage of Mathematics-I, Applied Physics, and Engineering Graphics for all BEU engineering branches",
      price: "₹1,499",
      originalPrice: "₹2,499",
      duration: "6 months",
      level: "1st Semester",
      students: 570,
      rating: 4.8,
      features: [ "Engineering Mathematics-I", "Applied Physics Lab", "Engineering Graphics", "Basic Electrical Engineering", "Workshop Practice", "All 12 Engineering Branches Covered" ],
      instructor: "BEU Faculty",
      status: "Enrollment Open",
      branches: "CE, ME, EE, ECE, CSE, IT, CHE, BT, AE, EN, PE, IE"
    },
    {
      id: 2,
      title: "2nd Semester - Chemistry & Programming (All Branches)",
      description: "Engineering Chemistry, Programming in C, and Mathematics-II for all BEU engineering branches",
      price: "₹1,499",
      originalPrice: "₹2,499",
      duration: "6 months",
      level: "2nd Semester",
      students: 565,
      rating: 4.9,
      features: [ "Engineering Chemistry", "Programming in C", "Mathematics-II", "Basic Electronics", "Environmental Studies", "All 12 Engineering Branches Covered" ],
      instructor: "BEU Faculty",
      status: "Enrollment Open",
      branches: "CE, ME, EE, ECE, CSE, IT, CHE, BT, AE, EN, PE, IE"
    },
    {
      id: 3,
      title: "3rd Semester - Branch Specialization Begins",
      description: "Branch-specific subjects for CE, ME, EE, ECE, CSE, IT, CHE, BT, AE, EN, PE, IE",
      price: "₹1,699",
      originalPrice: "₹2,799",
      duration: "6 months",
      level: "3rd Semester",
      students: 560,
      rating: 4.7,
      features: [ "Data Structures (CSE/IT)", "Strength of Materials (CE/ME)", "Network Analysis (EE/ECE)", "Thermodynamics (ME/CHE)", "Material Science", "Branch-specific Lab Work" ],
      instructor: "BEU Faculty",
      status: "Enrollment Open",
      branches: "CE, ME, EE, ECE, CSE, IT, CHE, BT, AE, EN, PE, IE"
    },
    {
      id: 4,
      title: "4th Semester - Core Branch Subjects",
      description: "Advanced branch-specific subjects for all BEU engineering disciplines",
      price: "₹1,699",
      originalPrice: "₹2,799",
      duration: "6 months",
      level: "4th Semester",
      students: 555,
      rating: 4.8,
      features: [ "OOP (CSE/IT)", "RCC Design (CE)", "Machine Design (ME/PE)", "Control Systems (EE)", "Digital Communication (ECE)", "Chemical Process Calculations (CHE)" ],
      instructor: "BEU Faculty",
      status: "Enrollment Open",
      branches: "CE, ME, EE, ECE, CSE, IT, CHE, BT, AE, EN, PE, IE"
    },
    {
      id: 5,
      title: "5th Semester - Advanced Engineering Concepts",
      description: "Specialized subjects for CE, ME, EE, ECE, CSE, IT, CHE, BT, AE, EN, PE, IE branches",
      price: "₹1,899",
      originalPrice: "₹2,999",
      duration: "6 months",
      level: "5th Semester",
      students: 550,
      rating: 4.9,
      features: [ "DBMS (CSE/IT)", "Geotechnical Engineering (CE)", "Heat Transfer (ME/CHE)", "Power Electronics (EE)", "Microprocessors (ECE)", "Bioprocess Engineering (BT)" ],
      instructor: "BEU Faculty",
      status: "Enrollment Open",
      branches: "CE, ME, EE, ECE, CSE, IT, CHE, BT, AE, EN, PE, IE"
    },
    {
      id: 6,
      title: "6th Semester - Industry Applications",
      description: "Industry-oriented subjects for all BEU engineering branches",
      price: "₹1,899",
      originalPrice: "₹2,999",
      duration: "6 months",
      level: "6th Semester",
      students: 545,
      rating: 4.8,
      features: [ "Software Engineering (CSE/IT)", "Transportation Engineering (CE)", "Manufacturing Technology (ME/PE)", "Power Systems (EE)", "VLSI Design (ECE)", "Chemical Reaction Engineering (CHE)" ],
      instructor: "BEU Faculty",
      status: "Enrollment Open",
      branches: "CE, ME, EE, ECE, CSE, IT, CHE, BT, AE, EN, PE, IE"
    },
    {
      id: 7,
      title: "7th Semester - Electives & Specialization",
      description: "Advanced electives and specialization subjects for all BEU engineering branches",
      price: "₹2,099",
      originalPrice: "₹3,299",
      duration: "6 months",
      level: "7th Semester",
      students: 540,
      rating: 4.9,
      features: [ "Machine Learning (CSE/IT)", "Advanced Structural Design (CE)", "Automation & Robotics (ME/EE)", "Embedded Systems (ECE)", "Process Design (CHE)", "Placement Preparation" ],
      instructor: "BEU Faculty",
      status: "Enrollment Open",
      branches: "CE, ME, EE, ECE, CSE, IT, CHE, BT, AE, EN, PE, IE"
    },
    {
      id: 8,
      title: "8th Semester - Final Year Project & Placement",
      description: "Major project guidance and placement preparation for all BEU engineering branches",
      price: "₹2,099",
      originalPrice: "₹3,299",
      duration: "6 months",
      level: "8th Semester",
      students: 535,
      rating: 4.9,
      features: [ "Major Project Guidance", "Technical Interview Preparation", "Industry Training", "Resume Building", "Campus Placement Training", "Final Examination Prep" ],
      instructor: "BEU Faculty & Industry Experts",
      status: "Enrollment Open",
      branches: "CE, ME, EE, ECE, CSE, IT, CHE, BT, AE, EN, PE, IE"
    }
  ];

  const handleEnrollNow = async (batch) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to enroll.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      const amount = parseInt(batch.price.replace(/[₹,]/g, ''));
      const backendUrl = 'http://localhost:3001/api/pay';
      const payload = {
        amount,
        courseName: batch.title,
        userId: user.id,
      };
      
      const response = await axios.post(backendUrl, payload);

      if (response.data.success && response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      } else {
        toast({ title: "Error", description: "Payment initiation failed.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Server Error", description: "Could not connect to payment server.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">BEU Semester Batches</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Complete semester-wise preparation for Bihar Engineering University (BEU) students. 
              Join our specialized batches covering all 8 semesters of your 4-year engineering program.
            </p>
          </div>
        </div>
      </section>

      {/* Batches Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {batches.map((batch) => (
              <Card key={batch.id} className="card-shadow hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-2">
                      <Badge variant={batch.status === "Starting Soon" ? "outline" : "secondary"} className="mb-2">
                        {batch.level}
                      </Badge>
                      <Badge variant={batch.status === "Starting Soon" ? "destructive" : "default"} className="ml-2">
                        {batch.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">{batch.price}</div>
                      <div className="text-sm text-muted-foreground line-through">{batch.originalPrice}</div>
                    </div>
                  </div>
                  <CardTitle className="text-2xl mb-2">{batch.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {batch.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{batch.duration}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Duration</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{batch.students}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Students</div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{batch.rating}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      What's Included:
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {batch.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Award className="h-4 w-4 text-accent" />
                    <div>
                      <div className="text-sm font-medium">Instructor</div>
                      <div className="text-sm text-muted-foreground">{batch.instructor}</div>
                    </div>
                  </div>
                  <Button 
                    className="w-full"
                    disabled={batch.status !== "Enrollment Open"}
                    onClick={() => handleEnrollNow(batch)}
                  >
                    {batch.status === "Enrollment Open" ? "Enroll Now" : batch.status}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* BEU Engineering Branches */}
      <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">All Engineering Branches at BEU</h2>
              <p className="text-xl text-muted-foreground">
                Bihar Engineering University offers 12 diverse engineering branches across its affiliated colleges
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {engineeringBranches.map((branch, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-primary">{branch.code}</div>
                      <Badge variant="secondary">{branch.seats} seats</Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{branch.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Available in all semester batches from 1st to 8th semester
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <div className="inline-flex items-center gap-4 p-4 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
                <div>
                  <div className="text-sm font-medium">Total Seats Available</div>
                  <div className="text-2xl font-bold text-primary">
                    {engineeringBranches.reduce((total, branch) => total + branch.seats, 0)} seats per year
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Batches */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Why Choose Our BEU Batches?</h2>
              <p className="text-xl text-muted-foreground">
                Specifically designed for Bihar Engineering University curriculum and syllabus
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Live Classes</h3>
                <p className="text-sm text-muted-foreground">Interactive live sessions with expert instructors</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Study Materials</h3>
                <p className="text-sm text-muted-foreground">Comprehensive notes and practice materials</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-secondary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Mock Tests</h3>
                <p className="text-sm text-muted-foreground">Regular assessments and performance tracking</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Doubt Support</h3>
                <p className="text-sm text-muted-foreground">24/7 doubt clearing and expert guidance</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Batches;
