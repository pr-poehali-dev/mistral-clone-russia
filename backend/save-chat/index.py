import json
import os
from typing import Dict, Any, List
from pydantic import BaseModel, Field
import psycopg2
from psycopg2.extras import RealDictCursor

class Message(BaseModel):
    role: str = Field(..., pattern='^(user|assistant|system)$')
    content: str = Field(..., min_length=1)

class SaveChatRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    messages: List[Message] = Field(..., min_items=1)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Save chat conversation to database
    Args: event - dict with httpMethod, body (title and messages array)
          context - object with request_id attribute
    Returns: HTTP response with saved chat_id
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    database_url = os.environ.get('DATABASE_URL')
    if not database_url:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Database not configured'}),
            'isBase64Encoded': False
        }
    
    body_data = json.loads(event.get('body', '{}'))
    chat_request = SaveChatRequest(**body_data)
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute(
        "INSERT INTO chats (title, created_at, updated_at) VALUES (%s, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id",
        (chat_request.title,)
    )
    chat_id = cursor.fetchone()['id']
    
    for msg in chat_request.messages:
        cursor.execute(
            "INSERT INTO messages (chat_id, role, content, created_at) VALUES (%s, %s, %s, CURRENT_TIMESTAMP)",
            (chat_id, msg.role, msg.content)
        )
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'chat_id': chat_id,
            'message': 'Chat saved successfully'
        }),
        'isBase64Encoded': False
    }
