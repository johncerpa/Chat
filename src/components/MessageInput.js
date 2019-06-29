import React, {useState} from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';

export default function MessageImput({handleSend}) {
  
  const [message, setMessage] = useState('');

  const handleMessageChange = e => setMessage(e.target.value);

  const handleSendClick = () => {
    if (message !== '') {
      handleSend(message);
      setMessage('');
    }
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter' && message !== '') {
      handleSend(message);
      setMessage('');
    }
  }

  return (
    <InputGroup className="fixed-bottom" size="md">
      <FormControl
        onChange={handleMessageChange}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        value={message}
        aria-label="Message"
        aria-describedby="basic-addon1"
      />
      <InputGroup.Append>
        <Button variant="primary" onClick={handleSendClick}>Send</Button>
      </InputGroup.Append>
    </InputGroup>
  )

}