
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { useEffect, useState } from "react";
import { AuthApi } from "~/api/api";
import { useNavigate } from "react-router";
import { toast } from "sonner";




export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const getUser = async () => {
    const response = await AuthApi.getUser();
    if (response.status === 201) {
      navigate('/');
    }
  }
  useEffect(() => {
    getUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await AuthApi.login(formData.email, formData.password);
  
      if (response.status === 201) {
        toast.success('Login successful!');
       navigate('/');
      }
    }
    catch (error: any) {
      toast.error(error.message || 'Login failed. Please try again.');
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 w-full max-w-md mx-auto">
      <div className="flex flex-col gap-6 w-full">
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </Field>
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                  </div>
                  <Input id="password" type="password" required value={formData.password || ""} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </Field>
                <Field>
                  <Button type="submit">Login</Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

