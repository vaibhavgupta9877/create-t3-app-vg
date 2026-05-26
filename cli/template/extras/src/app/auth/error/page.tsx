"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    Callback: "There was an error with the callback.",
    OAuthSignin: "There was an error signing in with OAuth provider.",
    OAuthCallback: "There was an error with the OAuth callback.",
    OAuthCreateAccount: "Could not create OAuth account.",
    EmailCreateAccount: "Could not create email account.",
    Callback: "There was an error in the callback handler.",
    OAuthAccountNotLinked:
      "Your account exists with a different provider. Sign in with the original provider.",
    EmailSignInError: "Check your email address.",
    CredentialsSignin:
      "Sign in failed. Check that your details are correct.",
    SessionCallback: "There was an error in the session callback.",
    default: "An authentication error occurred.",
  };

  const message = errorMessages[error ?? "default"] ?? errorMessages.default;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Authentication Error</CardTitle>
          <CardDescription>Something went wrong during authentication</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {message}
          </div>
          <Link href="/auth/signin">
            <Button className="w-full">Back to Sign In</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
