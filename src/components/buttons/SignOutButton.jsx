import React from "react";
import { auth } from "../../firebase";

export function SignOutButton() {
	return (
		auth.currentUser && (
			<button onClick={() => auth.signOut()}>Sign Out</button>
		)
	);
}
