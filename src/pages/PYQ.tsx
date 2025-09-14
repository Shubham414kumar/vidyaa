import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Search, Download, Upload, ChevronRight, ChevronLeft, FileText, Star, Eye,
  BookOpen, Cpu, Building, Wrench, Zap, Palette
} from "lucide-react";

// --- NEW STATE INTERFACE FOR UPLOAD FORM ---
interface UploadFormData {
  course: string;
  subject: string;
  semester: string;
  year: string;
  paperTitle: string;
  hasAnswers: boolean;
  file: File | null;
}

const PYQ = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // --- NEW: State to manage all the fields in the upload form ---
  const [uploadForm, setUploadForm] = useState<UploadFormData>({
    course: '', subject: '', semester: '1', year: '', paperTitle: '', hasAnswers: false, file: null
  });

  // --- NEW: Function to handle changes in the text inputs and select box ---
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUploadForm(prev => ({ ...prev, [name]: value }));
  };

  // --- NEW: Function to handle when a user selects a file ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadForm(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };
  
  // --- NEW: Function to handle the checkbox change ---
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadForm(prev => ({ ...prev, hasAnswers: e.target.checked }));
  };

  // --- NEW: The main function that sends the file to the backend ---
  const handleUpload = async () => {
    // 1. Check if all required fields are filled
    if (!uploadForm.file || !uploadForm.course || !uploadForm.subject || !uploadForm.paperTitle || !uploadForm.year) {
      toast({ title: "Missing Information", description: "Please fill all fields and select a PDF file.", variant: "destructive" });
      return;
    }

    setIsUploading(true);
    
    // 2. Create a FormData object to send the file and text data together
    const formData = new FormData();
    formData.append('course', uploadForm.course);
    formData.append('subject', uploadForm.subject);
    formData.append('semester', uploadForm.semester);
    formData.append('year', uploadForm.year);
    formData.append('paperTitle', uploadForm.paperTitle);
    formData.append('hasAnswers', String(uploadForm.hasAnswers));
    formData.append('pyqFile', uploadForm.file); // 'pyqFile' must match the backend name

    try {
      // 3. Send the data to your PYQ backend server
      const response = await axios.post("http://localhost:5001/api/upload-pyq", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast({ title: "Upload Successful!", description: `${response.data.data.originalName} has been uploaded.` });
      setIsUploadOpen(false); // Close the popup
      // Reset the form for the next upload
      setUploadForm({ course: '', subject: '', semester: '1', year: '', paperTitle: '', hasAnswers: false, file: null });

    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "An error occurred. Please check the server and try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false); // Re-enable the button
    }
  };

  // --- The rest of your code is unchanged ---
  const courses = [
    { id: "cse", name: "Computer Science Engineering", icon: Cpu, color: "from-blue-500 to-purple-600", subjects: ["Mathematics", "Physics", "Chemistry", "Programming", "Data Structures", "Computer Networks"] },
    { id: "ece", name: "Electronics & Communication", icon: Zap, color: "from-yellow-500 to-orange-600", subjects: ["Mathematics", "Physics", "Electronics", "Signal Processing", "Communication Systems", "Microprocessors"] },
    { id: "me", name: "Mechanical Engineering", icon: Wrench, color: "from-gray-500 to-gray-700", subjects: ["Mathematics", "Physics", "Engineering Mechanics", "Thermodynamics", "Fluid Mechanics", "Machine Design"] },
    { id: "ce", name: "Civil Engineering", icon: Building, color: "from-green-500 to-teal-600", subjects: ["Mathematics", "Physics", "Engineering Mechanics", "Structural Analysis", "Concrete Technology", "Surveying"] },
    { id: "ee", name: "Electrical Engineering", icon: Zap, color: "from-red-500 to-pink-600", subjects: ["Mathematics", "Physics", "Circuit Analysis", "Power Systems", "Control Systems", "Electrical Machines"] },
    { id: "design", name: "Design Engineering", icon: Palette, color: "from-purple-500 to-indigo-600", subjects: ["Design Fundamentals", "CAD", "Materials", "Aesthetics", "Product Design", "Industrial Design"] }
  ];

  const semesters = [
    { id: "1", name: "Semester 1" }, { id: "2", name: "Semester 2" }, { id: "3", name: "Semester 3" },
    { id: "4", name: "Semester 4" }, { id: "5", name: "Semester 5" }, { id: "6", name: "Semester 6" },
    { id: "7", name: "Semester 7" }, { id: "8", name: "Semester 8" }
  ];

  const subjectPDFs = [
    { id: 1, name: "Mid-Term Exam 2024", type: "Question Paper", uploadDate: "2024-07-15", downloads: 156, rating: 4.8, hasAnswers: true, fileSize: "2.3 MB" },
    { id: 2, name: "Final Exam 2023", type: "Question Paper", uploadDate: "2023-12-10", downloads: 203, rating: 4.9, hasAnswers: true, fileSize: "3.1 MB" },
    { id: 3, name: "Practice Set 1", type: "Practice Paper", uploadDate: "2024-06-20", downloads: 87, rating: 4.6, hasAnswers: false, fileSize: "1.8 MB" }
  ];

  const selectedCourseData = courses.find(course => course.id === selectedCourse);

  const handleBackToCourses = () => { setSelectedCourse(null); setSelectedSemester(null); };
  const handleBackToSemesters = () => { setSelectedSemester(null); };

  return (
    <div className="min-h-screen bg-background">
      <section className="py-20 gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 text-gradient">Previous Year Questions</h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Access a comprehensive collection of previous year question papers organized by courses and semesters.
            </p>
            
            {/* UPDATED DIALOG TO CONTROL ITS STATE */}
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="gradient-primary text-white shadow-lg hover:shadow-xl transition-all">
                  <Upload className="h-5 w-5 mr-2" /> Upload PYQ
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Previous Year Question</DialogTitle>
                  <DialogDescription>Help the community by sharing question papers.</DialogDescription>
                </DialogHeader>
                {/* UPDATED FORM TO CONNECT WITH STATE AND HANDLERS */}
                <div className="space-y-4">
                  <Input name="course" placeholder="Course name (e.g., B.Tech CSE)" value={uploadForm.course} onChange={handleFormChange} required />
                  <Input name="subject" placeholder="Subject name (e.g., Data Structures)" value={uploadForm.subject} onChange={handleFormChange} required />
                  <Input name="paperTitle" placeholder="Paper Title (e.g., Mid-Term 2024)" value={uploadForm.paperTitle} onChange={handleFormChange} required />
                  <div className="grid grid-cols-2 gap-4">
                    <select name="semester" value={uploadForm.semester} onChange={handleFormChange} className="w-full px-3 py-2 border border-input rounded-md bg-transparent">
                      {semesters.map(sem => <option key={sem.id} value={sem.id}>{sem.name}</option>)}
                    </select>
                    <Input name="year" placeholder="Year (e.g., 2023)" type="number" value={uploadForm.year} onChange={handleFormChange} required/>
                  </div>
                  <Input name="file" type="file" accept=".pdf" onChange={handleFileChange} required />
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="hasAnswers" checked={uploadForm.hasAnswers} onChange={handleCheckboxChange} />
                    <label htmlFor="hasAnswers" className="text-sm">This PDF includes an answer key</label>
                  </div>
                  <Button onClick={handleUpload} disabled={isUploading} className="w-full gradient-primary text-white">
                    {isUploading ? "Uploading..." : "Upload PDF"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {(selectedCourse || selectedSemester) && (
        <section className="py-4 border-b bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-2 text-sm">
              <Button variant="ghost" size="sm" onClick={handleBackToCourses} className="hover:bg-primary/10">
                <ChevronLeft className="h-4 w-4 mr-1" /> All Courses
              </Button>
              {selectedCourse && (
                <>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{selectedCourseData?.name}</span>
                </>
              )}
              {selectedSemester && (
                <>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  <Button variant="ghost" size="sm" onClick={handleBackToSemesters} className="hover:bg-primary/10">
                    Semester {selectedSemester}
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="py-20">
        <div className="container mx-auto px-4">
          {!selectedCourse ? (
             <>
               <div className="text-center mb-12">
                 <h2 className="text-3xl font-bold mb-4">Select Your Course</h2>
                 <p className="text-muted-foreground">Choose your engineering course to access question papers</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                 {courses.map((course) => {
                   const IconComponent = course.icon;
                   return (
                     <Card key={course.id} className="card-shadow hover:shadow-xl transition-all cursor-pointer group" onClick={() => setSelectedCourse(course.id)}>
                       <CardHeader className="text-center pb-4">
                         <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                           <IconComponent className="h-8 w-8 text-white" />
                         </div>
                         <CardTitle className="text-lg group-hover:text-primary transition-colors">{course.name}</CardTitle>
                         <CardDescription>{course.subjects.length} core subjects available</CardDescription>
                       </CardHeader>
                       <CardContent>
                         <div className="space-y-2">
                           <div className="flex justify-between text-sm text-muted-foreground">
                             <span>Semesters:</span><span className="font-medium">1-8</span>
                           </div>
                           <div className="flex justify-between text-sm text-muted-foreground">
                             <span>Papers:</span><span className="font-medium">150+ available</span>
                           </div>
                         </div>
                         <Button className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                           View Papers <ChevronRight className="h-4 w-4 ml-2" />
                         </Button>
                       </CardContent>
                     </Card>
                   );
                 })}
               </div>
             </>
           ) : !selectedSemester ? (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Select Semester</h2>
                <p className="text-muted-foreground">Choose semester for {selectedCourseData?.name}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {semesters.map((semester) => (
                  <Card key={semester.id} className="card-shadow hover:shadow-lg transition-all cursor-pointer group" onClick={() => setSelectedSemester(semester.id)}>
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                        <span className="text-xl font-bold">{semester.id}</span>
                      </div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">{semester.name}</h3>
                      <p className="text-sm text-muted-foreground mt-2">{selectedCourseData?.subjects.length} subjects</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">{selectedCourseData?.name} - Semester {selectedSemester}</h2>
                <p className="text-muted-foreground">Select a subject to view and download question papers</p>
              </div>
              <div className="max-w-md mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search subjects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10"/>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedCourseData?.subjects.filter(subject => subject.toLowerCase().includes(searchTerm.toLowerCase())).map((subject, index) => (
                  <Card key={index} className="card-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{subject}</CardTitle>
                            <CardDescription>Semester {selectedSemester}</CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground">{subjectPDFs.length} question papers available</div>
                      <div className="space-y-3">
                        {subjectPDFs.map((pdf) => (
                          <div key={pdf.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <FileText className="h-4 w-4 text-primary" />
                                <span className="font-medium text-sm">{pdf.name}</span>
                              </div>
                              <Badge variant={pdf.hasAnswers ? "default" : "secondary"} className="text-xs">
                                {pdf.hasAnswers ? "With Answers" : "Questions Only"}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                              <span>{pdf.type}</span><span>{pdf.fileSize}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                                <div className="flex items-center space-x-1"><Download className="h-3 w-3" /><span>{pdf.downloads}</span></div>
                                <div className="flex items-center space-x-1"><Star className="h-3 w-3 text-yellow-500 fill-current" /><span>{pdf.rating}</span></div>
                              </div>
                              <div className="flex space-x-1">
                                <Button size="sm" variant="outline" className="h-8 px-2"><Eye className="h-3 w-3" /></Button>
                                <Button size="sm" className="h-8 px-3"><Download className="h-3 w-3 mr-1" />Download</Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="py-20 gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gradient">Our Growing Collection</h2>
            <p className="text-xl text-muted-foreground">Comprehensive question papers from top universities</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center"><div className="text-4xl font-bold text-primary mb-2">1500+</div><div className="text-sm text-muted-foreground">Question Papers</div></div>
            <div className="text-center"><div className="text-4xl font-bold text-accent mb-2">50+</div><div className="text-sm text-muted-foreground">Subjects Covered</div></div>
            <div className="text-center"><div className="text-4xl font-bold text-success mb-2">25K+</div><div className="text-sm text-muted-foreground">Downloads</div></div>
            <div className="text-center"><div className="text-4xl font-bold text-purple-600 mb-2">8</div><div className="text-sm text-muted-foreground">Semesters</div></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PYQ;