import './App.css';

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
      <header className="App-header">
        <button onClick={apiCall}>Make API call</button>
      </header>
    </div>
  );
}

export default App;
