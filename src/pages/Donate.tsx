import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Donate = () => {
  const amounts = [100, 500, 1000, 2000, 5000];
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [donorInfo, setDonorInfo] = useState({
    name: "",
    course: "",
    college: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAmountClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setDonorInfo((prevInfo) => ({ ...prevInfo, [id]: value }));
  };

  const handleDonate = async () => {
    const finalAmount =
      selectedAmount !== null ? selectedAmount : parseInt(customAmount, 10) || 0;

    if (finalAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please select or enter a valid amount.",
        variant: "destructive",
      });
      return;
    }
    if (!donorInfo.name.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const backendUrl = "http://localhost:3001/api/donate";

      const payload = {
        amount: finalAmount,
        name: donorInfo.name,
        course: donorInfo.course,
        college: donorInfo.college,
        userId: user?.id || "GUEST_DONOR",
      };

      const response = await axios.post(backendUrl, payload);

      if (response.data.success && response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      } else {
        toast({
          title: "Error",
          description: "Payment initiation failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error initiating donation:", error);
      toast({
        title: "Server Error",
        description: "Could not connect to the payment server.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl shadow-lg border">
        <CardHeader className="text-center">
          <Heart className="h-14 w-14 mx-auto mb-4 text-red-500" />
          <CardTitle className="text-3xl font-bold">Support Education</CardTitle>
          <CardDescription>
            Your donation helps us provide free learning resources to students.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* --- Amount Selection Section --- */}
            <div>
              <Label className="block mb-2 font-medium">Select Amount</Label>
              <div className="grid grid-cols-3 gap-3">
                {amounts.map((amount) => (
                  <Button
                    key={amount}
                    variant={selectedAmount === amount ? "default" : "outline"}
                    onClick={() => handleAmountClick(amount)}
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>
              <div className="mt-4">
                <Input
                  type="text"
                  placeholder="Custom Amount"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                />
              </div>
            </div>

            {/* --- Donor Information Section --- */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={donorInfo.name} onChange={handleInfoChange} />
              </div>
              <div>
                <Label htmlFor="course">Course</Label>
                <Input id="course" value={donorInfo.course} onChange={handleInfoChange} />
              </div>
              <div>
                <Label htmlFor="college">College</Label>
                <Input id="college" value={donorInfo.college} onChange={handleInfoChange} />
              </div>
            </div>

            {/* --- Donate Button --- */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleDonate}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Donate Now"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Donate;
