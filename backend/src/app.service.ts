import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, withLatestFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
// import { WebhookHandler } from './webhook-handler.interface';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  async getName(userAccessToken: string): Promise<any> {
    const url = `https://graph.facebook.com/me?access_token=${userAccessToken}`;

    try {
      const response: any = await lastValueFrom(
        this.httpService.get(url, {
          headers: { Authorization: `Bearer ${userAccessToken}` },
        }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch Facebook name',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPages(userAccessToken: string, identifer?: string): Promise<any> {
    const url = `https://graph.facebook.com/me/accounts?access_token=${userAccessToken}`;

    try {
      const response: any = await lastValueFrom(
        this.httpService.get(url, {
          headers: { Authorization: `Bearer ${userAccessToken}` },
        }),
      );
      if (identifer === 'pages') {
        return response.data;
      }

      console.log(response.data);
      if (identifer === 'messages') {
        const conversations: any = await Promise.all(
          response.data.data.map(async (page) => {
            const conversation = await this.getConversations(
              page.access_token,
              userAccessToken,
            );
            return {
              pageToken: page.access_token,
              pageId: page.id,
              conversation,
            };
          }),
        );
        return conversations;
      }
      const posts: any = await Promise.all(
        response.data.data.map((page) => {
          return this.getAllPosts(page.access_token, userAccessToken, page.id);
        }),
      );
      return posts;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch Facebook pages',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Method to get pages conversation data
  async getConversations(pageToken: any, userAccessToken: any): Promise<any> {
    const url = `https://graph.facebook.com/me?fields=conversations&access_token=${pageToken}`;

    try {
      const response = await lastValueFrom(
        this.httpService.get(url, {
          headers: { Authorization: `Bearer ${userAccessToken}` },
        }),
      );
      console.log(response.data, 'ssss');
      return await Promise.all(
        response.data.conversations.data.map(async (conversation) => {
          const messagesList = await this.getMessages(
            conversation.id,
            pageToken,
            userAccessToken,
          );
          return {
            conversationId: conversation.id,
            messagesList,
          };
        }),
      );
    } catch (error) {
      throw new HttpException(
        'Failed to fetch Messenger data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMessages(
    conversationId: any,
    pageToken: any,
    userAccessToken: any,
  ): Promise<any> {
    const url = `https://graph.facebook.com/${conversationId}/messages?limit=1&fields=from,message,created_time,to&access_token=${pageToken}`;
    const response = await lastValueFrom(
      this.httpService.get(url, {
        headers: { Authorization: `Bearer ${userAccessToken}` },
      }),
    );
    console.log(response.data);
    return response.data;
  }
  catch(error) {
    throw new HttpException(
      'Failed to fetch messages',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  async messagesList(conversationId: string, pageToken: string): Promise<any> {
    const url = `https://graph.facebook.com/v20.0/${conversationId}/messages?&fields=id,from,message,created_time,to&access_token=${pageToken}`;
    try {
      const response = await lastValueFrom(this.httpService.get(url));

      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch Messenger data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllPosts(
    pageToken: string,
    userAccessToken: string,
    pageId: any,
  ): Promise<any> {
    const url = `https://graph.facebook.com/${pageId}/feed?access_token=${pageToken}`;
    try {
      const response = await lastValueFrom(
        this.httpService.get(url, {
          headers: { Authorization: `Bearer ${userAccessToken}` },
        }),
      );
      return await Promise.all(
        response.data.data.map(async (feeds) => {
          const attachments = await this.getPostAttachments(
            pageToken,
            userAccessToken,
            feeds.id,
          );
          return {
            message: feeds.message,
            created_time: feeds.created_time,
            attachments,
          };
        }),
      );
    } catch (error) {
      throw new HttpException(
        'Failed to fetch Messenger data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPostAttachments(
    pageToken: string,
    userAccessToken: string,
    postId: any,
  ): Promise<any> {
    const url = `https://graph.facebook.com/${postId}/attachments?access_token=${pageToken}`;
    try {
      const response = await lastValueFrom(
        this.httpService.get(url, {
          headers: { Authorization: `Bearer ${userAccessToken}` },
        }),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch Messenger data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // Method to send a message to a user
  async sendMessage(
    psid: string,
    message: string,
    pageToken: string,
    pageId: string,
  ): Promise<any> {
    const url = `https://graph.facebook.com/v20.0/${pageId}/messages?access_token=${pageToken}`;

    const payload = {
      recipient: {
        id: psid,
      },
      message: {
        text: message,
      },
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post(url, payload, {
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to send message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getComments(postId: string, pageToken: string): Promise<any> {
    const url = `https://graph.facebook.com/v20.0/${postId}/comments?access_token=${pageToken}`;
    try {
      const response = await lastValueFrom(
        this.httpService.get(url, {
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch Messenger data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async postComments(
    postId: string,
    userAccessToken: string,
    message: string,
  ): Promise<any> {
    const url = `https://graph.facebook.com/v20.0/${postId}/comments?access_token=${userAccessToken}`;

    const payload = {
      message: message,
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post(url, payload, {
          headers: { 'Content-Type': 'application/json' },
        }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'failed to post comment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async replyOnComment(
    commentId: string,
    pageToken: string,
    message: string,
  ): Promise<any> {
    const url = `https://graph.facebook.com/v20.0/${commentId}/comments?access_token=${pageToken}`;

    const payload = {
      message: message,
    };
    try {
      const response = await lastValueFrom(
        this.httpService.post(url, payload, {
          headers: { 'Content-Type': 'application/json' },
        }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'failed to reply comment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async readCommentReply(commentId: string, pageToken: string): Promise<any> {
    const url = `https://graph.facebook.com/v20.0/${commentId}/comments?access_token=${pageToken}`;

    try {
      const response = await lastValueFrom(
        this.httpService.get(url, {
          params: { pageToken: pageToken },
        }),
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'failed to reply comment',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
