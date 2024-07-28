import React from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export function SignInButton() {
	const auth = getAuth();

	const signInWithGoogle = () => {
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider)
			.then((result) => {
				// This gives you a Google Access Token. You can use it to access the Google API.
				// const credential =
				// 	GoogleAuthProvider.credentialFromResult(result);
				// // const token = credential.accessToken;
				// // The signed-in user info.
				// const user = result.user;
			})
			.catch((error) => {
				// Handle Errors here.
			});
	};

	return (
		<button onClick={signInWithGoogle} className="sign-in">
			Sign in with Google
		</button>
	);
}
