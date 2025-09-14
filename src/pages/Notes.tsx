import { useState } from "react";
// import Header from "@/components/Header";
// import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Search, 
  Download, 
  Upload, 
  BookOpen, 
  FileText,
  Star,
  Eye,
  Filter
} from "lucide-react";

const Notes = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Engineering", "12th Grade", "10th Grade", "Competitive"];

  const notes = [
    {
      id: 1,
      title: "Calculus and Differential Equations",
      subject: "Mathematics",
      category: "Engineering",
      description: "Complete notes on calculus, limits, derivatives, and differential equations for engineering students",
      author: "Prof. Sharma",
      downloads: 1234,
      rating: 4.8,
      pages: 156,
      size: "2.5 MB",
      uploadedBy: "VidyaSphere Team",
      date: "2024-01-15"
    },
    {
      id: 2,
      title: "Organic Chemistry Reactions",
      subject: "Chemistry", 
      category: "12th Grade",
      description: "Comprehensive guide to organic chemistry reactions, mechanisms, and problem-solving techniques",
      author: "Dr. Verma",
      downloads: 987,
      rating: 4.9,
      pages: 89,
      size: "1.8 MB",
      uploadedBy: "Student Contributor",
      date: "2024-01-10"
    },
    {
      id: 3,
      title: "Physics Mechanics & Thermodynamics",
      subject: "Physics",
      category: "Engineering",
      description: "Detailed physics notes covering mechanics, thermodynamics, and numerical problems",
      author: "Prof. Singh",
      downloads: 756,
      rating: 4.7,
      pages: 203,
      size: "3.1 MB",
      uploadedBy: "VidyaSphere Team",
      date: "2024-01-08"
    },
    {
      id: 4,
      title: "English Literature & Grammar",
      subject: "English",
      category: "10th Grade",
      description: "Complete English notes with literature analysis, grammar rules, and writing techniques",
      author: "Mrs. Gupta",
      downloads: 1456,
      rating: 4.6,
      pages: 67,
      size: "1.2 MB",
      uploadedBy: "Teacher",
      date: "2024-01-05"
    },
    {
      id: 5,
      title: "Data Structures and Algorithms",
      subject: "Computer Science",
      category: "Engineering",
      description: "Comprehensive notes on DSA concepts, algorithms, and problem-solving strategies",
      author: "Shubham Kumar",
      downloads: 2134,
      rating: 4.9,
      pages: 298,
      size: "4.2 MB",
      uploadedBy: "VidyaSphere Team",
      date: "2024-01-20"
    },
    {
      id: 6,
      title: "Quantitative Aptitude",
      subject: "Mathematics",
      category: "Competitive",
      description: "Complete guide for competitive exam mathematics with shortcuts and practice problems",
      author: "Expert Faculty",
      downloads: 1678,
      rating: 4.8,
      pages: 134,
      size: "2.1 MB",
      uploadedBy: "VidyaSphere Team",
      date: "2024-01-18"
    }
  ];

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || note.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}
      
      {/* Hero Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Study Notes</h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              Access comprehensive study notes for Engineering, 10th, and 12th classes. 
              Download high-quality content created by experts and experienced teachers.
            </p>
            
            {/* Upload Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="mb-8">
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Notes
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Upload Your Notes</DialogTitle>
                  <DialogDescription>
                    Share your knowledge with the community by uploading your study notes
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title</label>
                    <Input placeholder="Enter note title" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subject</label>
                    <Input placeholder="e.g., Mathematics, Physics" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select className="w-full px-3 py-2 border border-input rounded-md">
                      <option>Engineering</option>
                      <option>12th Grade</option>
                      <option>10th Grade</option>
                      <option>Competitive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">File</label>
                    <Input type="file" accept=".pdf,.doc,.docx" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-input rounded-md" 
                      rows={3}
                      placeholder="Brief description of the notes content"
                    ></textarea>
                  </div>
                  <Button className="w-full">Upload Notes</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search notes by title, subject, or keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notes Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No notes found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <Card key={note.id} className="card-shadow hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary">{note.category}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{note.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                    <CardDescription className="text-sm">
                      <span className="font-medium">{note.subject}</span> • {note.author}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {note.description}
                    </p>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {note.downloads} downloads
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {note.pages} pages
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {note.size}
                      </div>
                      <div>
                        {new Date(note.date).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Upload Info */}
                    <div className="text-xs text-muted-foreground border-t pt-2">
                      Uploaded by: <span className="font-medium">{note.uploadedBy}</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Upload Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <Card className="max-w-3xl mx-auto card-shadow">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Contribute to Our Community</CardTitle>
              <CardDescription>
                Have quality notes that could help other students? Upload them and help build our knowledge base!
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <Upload className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold mb-1">Easy Upload</h3>
                  <p className="text-sm text-muted-foreground">Simple process to upload your notes</p>
                </div>
                <div>
                  <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                  <h3 className="font-semibold mb-1">Get Recognition</h3>
                  <p className="text-sm text-muted-foreground">Build your reputation in the community</p>
                </div>
                <div>
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-accent" />
                  <h3 className="font-semibold mb-1">Help Others</h3>
                  <p className="text-sm text-muted-foreground">Share knowledge and help students succeed</p>
                </div>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg">
                    <Upload className="h-5 w-5 mr-2" />
                    Upload Your Notes
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Upload Your Notes</DialogTitle>
                    <DialogDescription>
                      Share your knowledge with the community
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input placeholder="Note title" />
                    <Input placeholder="Subject" />
                    <select className="w-full px-3 py-2 border border-input rounded-md">
                      <option>Select Category</option>
                      <option>Engineering</option>
                      <option>12th Grade</option>
                      <option>10th Grade</option>
                      <option>Competitive</option>
                    </select>
                    <Input type="file" accept=".pdf,.doc,.docx" />
                    <textarea 
                      className="w-full px-3 py-2 border border-input rounded-md" 
                      rows={3}
                      placeholder="Description"
                    ></textarea>
                    <Button className="w-full">Upload</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  );
};

export default Notes; 
