import { User, MapPin, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/auth.hooks";
import { useUser } from "../users.hooks";
import { useAddresses } from "@/features/addresses/addresses.hooks";
import { ProfileSkeleton } from "../components/ProfileSkeleton";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { getProfileData: user, isGetProfileLoading } = useUser();
  const { addresses } = useAddresses();

  if (!isAuthenticated)
    return (
      <div className="container py-20 text-center">
        <User className="mx-auto h-16 w-16 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">
          Sign in to view your profile
        </h1>
        <Link to="/login">
          <Button className="mt-4">Sign In</Button>
        </Link>
      </div>
    );

  if (isGetProfileLoading) return <ProfileSkeleton />;

  return (
    <div className="container py-8">
      <h1 className="mb-8 text-3xl font-bold">My Profile</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <strong>Name:</strong> {user?.firstName} {user?.lastName}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Phone:</strong> {user?.phone || "Not set"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Addresses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {addresses?.map((addr) => (
              <div key={addr.id} className="border-b pb-2 mb-2 last:border-0">
                <p className="font-medium">{addr.full_name}</p>
                <p className="text-sm text-muted-foreground">
                  {addr.address_line}, {addr.city}, {addr.state} {addr.zip_code}, {addr.country}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Button
        variant="destructive"
        className="mt-6 gap-2"
        onClick={() => {
          logout();
          navigate("/");
        }}
      >
        <LogOut className="h-4 w-4" />
        Log Out
      </Button>
    </div>
  );
};

export default ProfilePage;
