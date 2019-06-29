import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import './style/style.css';
import Message from './components/Message';
import MessageInput from './components/MessageInput';
import NameInput from './components/NameInput';
import Alert from 'react-bootstrap/Alert';
import Fade from 'react-reveal/Fade';
import openSocket from 'socket.io-client';

let socket = openSocket('');

function App() {

  const [name, setName] = useState('');
  const [messages, setMessages] = useState([]);
  const [variant, setVariant] = useState('success');
  const [alertText, setAlertText] = useState('Thank you for connecting! Type in your name to start chatting.');

  const handleNameChange = name => setName(name);

  const handleSend = async (msg)  => {
    if (name !== '') {
      
      const newMessage = {name, message: msg};

      setMessages([...messages, newMessage]);

      // Send message to the other sockets
      socket.emit('message', {name, message: msg});
      
      // Save message in database
      fetch(`/messages`,
        {
          method: 'POST',
          mode: 'cors',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({name: name, message: msg})
        }
      );
      
      // Scroll to the bottom of the page
      window.scrollTo({left: 0, top: document.body.scrollHeight, behavior: 'smooth'});

    } else {
      setTimeout(() => setVariant(''), 4000);
      setVariant('warning');
      setAlertText('You should type your name before sending a message!');
    }
  }

  socket.on('messageReceived', ({name, message}) => {
    setMessages([...messages, {name, message}]);
  })

  useEffect(() => {
    setTimeout(() => setVariant(''), 4000);

    const getMessages = async () => {
      const fetchResponse = await fetch(`/messages`);
      const msgs = await fetchResponse.json();
      setMessages([...msgs]);
    }

    getMessages();
    
  }, []);

  

  return (
    <div className="App">
      {variant !== ''
        ? 
          <Alert className="fixed-top" variant={variant}>
            <Fade top>
              {alertText}
            </Fade>
          </Alert>
        : <NameInput handleNameChange={handleNameChange} />
      }      

      <div className="container-fluid overflow-auto">
        {messages.map(({name, message}, index) => 
          <Message key={index} name={name} message={message} />
        )}        
        
        <MessageInput handleSend={handleSend} />
      </div>
    </div> 
  );
}

export default App;