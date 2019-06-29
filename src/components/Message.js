import React from 'react';
import Card from 'react-bootstrap/Card';

export default function Message({name, message}) {
  return (
    <Card className="mb-2">
      <Card.Body className="text-justify"><strong>{name}: </strong>{message}</Card.Body>
    </Card>
  )
}