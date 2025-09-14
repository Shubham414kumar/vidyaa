import { Link } from "react-router-dom";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-accent rounded-lg">
                <GraduationCap className="h-6 w-6 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold text-gradient">VidyaSphere</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Your comprehensive platform for Engineering, 10th, and 12th education. 
              Learn, grow, and excel with our expert guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link to="/batches" className="text-muted-foreground hover:text-primary">Batches</Link></li>
              <li><Link to="/notes" className="text-muted-foreground hover:text-primary">Notes</Link></li>
              <li><Link to="/pyq" className="text-muted-foreground hover:text-primary">Previous Year Questions</Link></li>
              <li><Link to="/attendance" className="text-muted-foreground hover:text-primary">Attendance</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
              <li><Link to="/donate" className="text-muted-foreground hover:text-primary">Donate</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>shubhammrdm394@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+91 7667928057</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Begusarai , Bihar , India , 851112 </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 VidyaSphere. All rights reserved. Built with ❤️ by four dedicated flatmates.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;