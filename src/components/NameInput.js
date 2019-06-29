import React from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

export default function NameInput({handleNameChange}) {
  return (
    <InputGroup className="fixed-top" size="md">
      <InputGroup.Prepend>
        <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
      </InputGroup.Prepend>
      <FormControl
        onChange={e => handleNameChange(e.target.value)}
        placeholder="Type your name here..."
        aria-label="Name"
        aria-describedby="basic-addon1"
      />
    </InputGroup>
  )
}