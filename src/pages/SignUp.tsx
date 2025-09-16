import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Smartphone } from "lucide-react";

const SignUp = () => {
  const [step, setStep] = useState<"details" | "otp">("details");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    college: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [canResendOTP, setCanResendOTP] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const startCountdown = () => {
    setCanResendOTP(false);
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResendOTP(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post("https://backend-1-yuaw.onrender.com/api/signup-send-otp", formData);
      toast({ title: "OTP Sent", description: `Verification code sent to +91 ${formData.phone}` });
      setStep("otp");
      startCountdown();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to send OTP. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = { phone: formData.phone, otp };
      await axios.post("https://backend-1-yuaw.onrender.com/api/signup-verify-otp", payload);
      toast({ title: "Account Created!", description: "Welcome to VidyaSphere! Please log in to continue." });
      navigate("/login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast({
          title: "Verification Failed",
          description: error.response?.data?.message || "An error occurred.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Verification Failed",
          description: "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <div className="w-full max-w-md px-4">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              {step === "details" ? (
                <UserPlus className="h-8 w-8 text-primary-foreground" />
              ) : (
                <Smartphone className="h-8 w-8 text-primary-foreground" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold">
              {step === "details" ? "Create Account" : "Verify Phone"}
            </CardTitle>
            <CardDescription>
              {step === "details"
                ? "Join VidyaSphere and start your learning journey"
                : `Enter the 6-digit code sent to +91 ${formData.phone}`}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {step === "details" ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number</Label>
                  <Input id="phone" type="tel" maxLength={10} value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="course">Course</Label>
                  <Input id="course" placeholder="e.g., B.Tech CSE" value={formData.course} onChange={(e) => handleInputChange("course", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="college">College Name</Label>
                  <Input id="college" placeholder="e.g., IIT Delhi" value={formData.college} onChange={(e) => handleInputChange("college", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} required />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Verification Code</Label>
                  <Input
                    id="otp"
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="text-center tracking-widest"
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full" size="lg">
                  {isLoading ? "Verifying..." : "Verify & Create Account"}
                </Button>
                <div className="text-center text-sm">
                  {canResendOTP ? (
                    <Button variant="link" onClick={() => handleSendOTP()} type="button">
                      Resend OTP
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">Resend OTP in {countdown}s</span>
                  )}
                </div>
              </form>
            )}

            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
