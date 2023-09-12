import "./App.css";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Banner from "./Components/Banner";
import Footer from "./Components/Footer";


function App() {
  return (
    <div className="App">
      <Navbar />
      <Banner />
      <Home />
      <Footer />
    </div>
  );
}

export default App;
