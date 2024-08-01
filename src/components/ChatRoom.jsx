import React, { useState, useRef, useEffect } from "react";
// import { useCollectionData } from "react-firebase-hooks/firestore";
import {
	addDoc,
	collection,
	serverTimestamp,
	query,
	orderBy,
	onSnapshot,
	limit,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { ChatMessage } from "./ChatMessage";
import axios from "axios";

export function ChatRoom() {
	const NUMBER_OF_VIEWABLE_MESSAGES = 25;
	const [messages, setMessages] = useState();
	const [formValue, setFormValue] = useState("");
	const API_URL =
		"https://api-inference.huggingface.co/models/michellejieli/emotion_text_classifier";
	const API_KEY = "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";

	const dummy = useRef();

	useEffect(() => {
		dummy.current.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	useEffect(() => {
		const q = query(
			collection(db, "messages"),
			orderBy("createdAt", "desc"),
			limit(NUMBER_OF_VIEWABLE_MESSAGES)
		);
		const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
			const fetchedMessages = [];
			QuerySnapshot.forEach((doc) => {
				fetchedMessages.push({ ...doc.data(), id: doc.id });
			});
			const sortedMessages = fetchedMessages.sort(
				(a, b) => a.createdAt - b.createdAt
			);
			setMessages(sortedMessages);
		});
		return () => unsubscribe;
	}, []);

	const sendMessage = async (e) => {
		e.preventDefault();
		// const res = await axios.post(
		// 	process.env.NODE_ENV === "dev"
		// 		? "http://127.0.0.1:5000/chat"
		// 		: "https://ai-chat-analyzer.onrender.com/chat",
		// 	{
		// 		message: formValue,
		// 		ai_enabled: true,
		// 	}
		// );

		const res = await axios.post(
			API_URL,
			{
				inputs: formValue,
			},
			{
				headers: {
					Authorization: `Bearer ${API_KEY}`,
					"Content-Type": "application/json",
				},
			}
		);

		const { uid, photoURL, displayName } = auth.currentUser;
		await addDoc(collection(db, "messages"), {
			text: `${formValue} (${res.data[0][0].label})`,
			createdAt: serverTimestamp(),
			displayName,
			uid,
			photoURL,
		});
		setFormValue("");
	};

	return (
		<>
			<main>
				<div>
					{messages &&
						messages.map((msg) => (
							<ChatMessage key={msg.id} message={msg} />
						))}
					<span ref={dummy}></span>
				</div>
				<form onSubmit={sendMessage}>
					<input
						value={formValue}
						onChange={(e) => setFormValue(e.target.value)}
						placeholder="type something here."
					/>

					<button type="submit" disabled={!formValue}>
						🕊️
					</button>
				</form>
			</main>
		</>
	);
}
