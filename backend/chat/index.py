import json
import os
from typing import Dict, Any, List
from pydantic import BaseModel, Field

class Message(BaseModel):
    role: str = Field(..., pattern='^(user|assistant|system)$')
    content: str = Field(..., min_length=1)

class ChatRequest(BaseModel):
    messages: List[Message] = Field(..., min_items=1)
    model: str = Field(default='gpt-3.5-turbo')

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: AI chat endpoint for processing user messages with OpenAI GPT models
    Args: event - dict with httpMethod, body (JSON with messages array)
          context - object with request_id, function_name attributes
    Returns: HTTP response with AI generated reply
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
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        chat_request = ChatRequest(**body_data)
        
        api_key = os.environ.get('OPENAI_API_KEY')
        if not api_key:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'OpenAI API key not configured'}),
                'isBase64Encoded': False
            }
        
        import requests
        
        openai_response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            },
            json={
                'model': chat_request.model,
                'messages': [msg.dict() for msg in chat_request.messages],
                'temperature': 0.7,
                'max_tokens': 1000
            },
            timeout=30
        )
        
        if openai_response.status_code != 200:
            return {
                'statusCode': openai_response.status_code,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'OpenAI API error',
                    'details': openai_response.text
                }),
                'isBase64Encoded': False
            }
        
        response_data = openai_response.json()
        ai_message = response_data['choices'][0]['message']['content']
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'message': ai_message,
                'model': chat_request.model,
                'request_id': context.request_id
            }),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
