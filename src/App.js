import React, { useState, useEffect } from 'react';
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
  const [alertText, setAlertText] = useState(
    'Thank you for connecting! Type in your name to start chatting.'
  );

  const handleNameChange = name => setName(name);
  const saveMessageInDB = message => {
    fetch(`/messages`, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
  };

  const handleSend = async msg => {
    if (name !== '') {
      const newMessage = { name, message: msg };
      setMessages([...messages, newMessage]);
      socket.emit('message', newMessage);
      saveMessageInDB(newMessage);

      if (msg.includes('#question')) {
        const question = msg.slice(msg.indexOf('#') + 9, msg.length);

        const BOT_URI =
          'https://qnauninorte.azurewebsites.net/qnamaker/knowledgebases/30eabc81-7806-4433-a60b-7f9710dc4880/generateAnswer';

        fetch(BOT_URI, {
          method: 'POST',
          mode: 'cors',
          headers: {
            Authorization: 'EndpointKey bac51036-4dc3-410a-8c10-ce9f2e450804',
            'Content-type': 'application/json'
          },
          body: JSON.stringify({ question })
        })
          .then(botResponse => botResponse.json())
          .then(parsedRes => {
            const answer = parsedRes.answers[0].answer;
            const ansObj = { name: 'Bot', message: answer };

            // Update React messages
            setMessages([...messages, newMessage, ansObj]);

            socket.emit('message', ansObj);
            saveMessageInDB(ansObj);
          });
      }

      // Scroll to the bottom of the chat
      window.scrollTo({
        left: 0,
        top: document.querySelector('#thechat').scrollHeight,
        behavior: 'smooth'
      });
    } else {
      setTimeout(() => setVariant(''), 4000);
      setVariant('warning');
      setAlertText('You should type your name before sending a message!');
    }
  };

  socket.on('messageReceived', ({ name, message }) => {
    setMessages([...messages, { name, message }]);
  });

  useEffect(() => {
    setTimeout(() => setVariant(''), 4000);

    const getMessages = async () => {
      const fetchResponse = await fetch(`/messages`);
      const msgs = await fetchResponse.json();
      setMessages([...msgs]);
    };

    getMessages();
  }, []);

  return (
    <div className="App">
      {variant !== '' ? (
        <Alert className="fixed-top" variant={variant}>
          <Fade top>{alertText}</Fade>
        </Alert>
      ) : (
        <NameInput handleNameChange={handleNameChange} />
      )}

      <div className="container-fluid overflow-auto" id="thechat">
        {messages.map(({ name, message }, index) => (
          <Message key={index} name={name} message={message} />
        ))}

        <MessageInput handleSend={handleSend} />
      </div>
    </div>
  );
}

export default App;
