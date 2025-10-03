import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Get specific chat with all messages
    Args: event - dict with httpMethod, queryStringParameters (chat_id)
          context - object with request_id attribute
    Returns: HTTP response with chat details and messages
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    query_params = event.get('queryStringParameters') or {}
    chat_id = query_params.get('chat_id')
    
    if not chat_id:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'chat_id is required'}),
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
    
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
    
    cursor.execute("SELECT id, title, created_at, updated_at FROM chats WHERE id = %s", (chat_id,))
    chat = cursor.fetchone()
    
    if not chat:
        cursor.close()
        conn.close()
        return {
            'statusCode': 404,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Chat not found'}),
            'isBase64Encoded': False
        }
    
    cursor.execute(
        "SELECT id, role, content, created_at FROM messages WHERE chat_id = %s ORDER BY created_at ASC",
        (chat_id,)
    )
    messages = cursor.fetchall()
    cursor.close()
    conn.close()
    
    messages_list = []
    for msg in messages:
        messages_list.append({
            'id': str(msg['id']),
            'role': msg['role'],
            'content': msg['content'],
            'timestamp': msg['created_at'].isoformat() if msg['created_at'] else None
        })
    
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({
            'id': chat['id'],
            'title': chat['title'],
            'messages': messages_list
        }),
        'isBase64Encoded': False
    }
