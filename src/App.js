import logo from "./logo.svg";
import "./App.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { SignInButton, SignOutButton } from "./components/buttons";
import { ChatRoom } from "./components/ChatRoom";

function App() {
    const [user] = useAuthState(auth);

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1>⚛️🔥💬</h1>
                <SignOutButton />
            </header>
            <section>{user ? <ChatRoom /> : <SignInButton />}</section>
        </div>
    );
}

export default App;
