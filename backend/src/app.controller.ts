import {
  Controller,
  Get,
  UseGuards,
  HttpStatus,
  Req,
  Res,
  HttpException,
  Post,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AppService } from './app.service';
import { WebHookService } from './webHook.service';
@Controller()
export class AppController {
  private tok: any;
  private accessToken: string = process.env.FB_ACCESS_TOKEN;

  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService,
  ) {}

  private getToken(token: any): void {
    this.tok = token;
  }

  @Get('/facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookLoginRedirect(@Req() req: Request) {
    this.getToken(req.user);
    return {
      statusCode: HttpStatus.OK,
      data: req.user,
    };
  }

  //get pages list

  @Get('/facebook/name')
  async getNames() {
    const response = await this.appService.getName(this.accessToken);
    return response;
  }

  @Get('/facebook/pages')
  async getPagesList() {
    const response = await this.appService.getPages(this.accessToken, 'pages');
    return response.data;
  }

  @Get('/facebook/pages/conversations')
  async getPages() {
    // if (!this.tok?.accessToken) {
    //   throw new HttpException(
    //     'Access token is required',
    //     HttpStatus.BAD_REQUEST,
    //   );
    // }

    const response = await this.appService.getPages(
      this.accessToken,
      'messages',
    );
    return response;
  }
  // // // post pages list
  // @Post('/facebook/pages')
  // async getPages(@Req() req: Request) {
  //   // console.log('hello', req.body);
  //   if (!req.body) {
  //     throw new HttpException(
  //       'Access token is required',
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  //   const response = await this.appService.getPages(req.body.access_token);
  //   return response;
  // }

  @Post('/facebook/pages/conversations')
  async postMessagesLIst(@Req() req: Request) {
    const { conversationId, pageToken } = req.body;
    console.log(conversationId, pageToken);
    if (!conversationId || !pageToken) {
      throw new HttpException(
        'PSID and message are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const response = await this.appService.messagesList(
      conversationId,
      pageToken,
    );

    return response;
  }

  @Get('/facebook/pages/posts')
  async getPagesPosts() {
    const response = await this.appService.getPages(this.accessToken);
    return response;
  }

  @Post('/facebook/pages/message')
  async sendMessages(@Req() req: Request) {
    const { psid, message, pageToken, pageId } = req.body;

    if (!psid) {
      throw new HttpException('PSID are required', HttpStatus.BAD_REQUEST);
    }

    if (!pageToken || !pageId) {
      throw new HttpException(
        ' pageToken or pageId are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const response = await this.appService.sendMessage(
      psid,
      message,
      pageToken,
      pageId,
    );
    return response;
  }

  @Post('/facebook/pages/message/test')
  async handleWebHook(@Req() req: Request): Promise<any> {
    const body = req.body;

    if (body.object === 'page') {
      body.entry.forEach(async (entry) => {
        const webhookEvent = entry.messaging[0];
        const psid = webhookEvent.sender.id;
        const message = webhookEvent.message.text;
        const pageToken = process.env.PAGE_ACCESS_TOKEN;
        const pageId = entry.id;

        if (psid && message && pageToken && pageId) {
          await this.appService.sendMessage(psid, message, pageToken, pageId);
        }
      });

      return { status: 'EVENT_RECEIVED' };
    } else {
      throw new HttpException('Event not handled', HttpStatus.NOT_FOUND);
    }
  }

  @Post('/facebook/pages/post/comments')
  async readComments(@Req() req: Request) {
    const { postId, pageToken } = req.body;

    if (!postId) {
      throw new HttpException('postId are required', HttpStatus.BAD_REQUEST);
    }
    const response = await this.appService.getComments(postId, pageToken);
    return response;
  }

  @Post('/facebook/pages/post/comment/add')
  async postMessage(@Req() req: Request) {
    const { postId, message, pageToken } = req.body;

    if (!postId) {
      throw new HttpException(
        'postId and message are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const response = await this.appService.postComments(
      postId,
      pageToken,
      message,
    );

    return response;
  }
  @Post('/facebook/pages/post/comment/reply/add')
  async postComment(@Req() req: Request) {
    const { commentId, message, pageToken } = req.body;
    if (!commentId || !pageToken) {
      throw new HttpException(
        'commentId or pageToken is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const response = await this.appService.replyOnComment(
      commentId,
      pageToken,
      message,
    );
    return response;
  }
  @Post('/facebook/pages/post/comment/reply/read')
  async readComment(@Req() req: Request) {
    const { commentId, pageToken } = req.body;

    if (!commentId || !pageToken) {
      throw new HttpException(
        'commentId or pageToken is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const response = await this.appService.readCommentReply(
      commentId,
      pageToken,
    );
    return response;
  }
}
