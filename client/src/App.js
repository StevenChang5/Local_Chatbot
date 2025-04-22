import './App.css';
import Register from './auth/Register';
import Login from './auth/Login';

const apiCall = () => {
  fetch('http://localhost:8080')
    .then(response => response.text())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Fetch error:', error);
  });
}

function App() {
  return (
    <div className="App">
      <h1>Local Chatbot Login</h1>
      <Register />
      <hr />
      <Login />
      <header className="App-header">
        <button onClick={apiCall}>Make API call</button>
      </header>
      
    </div>
  );
}

export default App;
