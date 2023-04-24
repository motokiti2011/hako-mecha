import { Injectable } from '@angular/core';
import { catchError, Observable, of, } from 'rxjs';
import { map } from 'rxjs/operators';
import { slipQuestion } from 'src/app/entity/slipQuestion';
import { HttpClient, HttpResponse, HttpClientJsonpModule, HttpErrorResponse, } from '@angular/common/http';
import { loginUser } from 'src/app/entity/loginUser';
import { ApiSerchService } from 'src/app/page/service/api-serch.service';
import { ApiUniqueService } from 'src/app/page/service/api-unique.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionBoardService {



  constructor(
    private apiService: ApiSerchService,
    private apiUniqueService: ApiUniqueService,
  ) { }

  /**
   * 解答状況を確認し設定を行う
   * @param slipQuestion
   * @param param1
   */
  public anserCheck(slipQuestion: slipQuestion[]): slipQuestion[] {
    let count = 1;
    slipQuestion.forEach(data => {
      // data.id = count;
      // 未回答の場合解答メッセージを設定する。
      if (data.anserDiv == '0') {
        data.anserText = '未回答';
      } else if(data.anserDiv == ''
      && data.anserText =='') {
        data.anserText = '未回答';
      }
      count = count + 1;
    });
    return slipQuestion;
  }

  /**
   * 伝票に紐づく質問情報を登録する。
   * @param slipNo
   * @returns
   */
  public sernderQuestion(
    userId: string, userName: string, slipNo: string,
     serviceType: string, text: string): Observable<any> {
    const data = this.createQuestion(userId, userName, slipNo, text)
    return this.apiUniqueService.sendQuestion(data, serviceType);
  }

  /**
   * 質問情報の回答内容を更新する
   * @param slipQuestion
   */
  public anserQuestion(slipQuestion: slipQuestion):Observable<any> {
    const data: slipQuestion = slipQuestion;
    data.anserDiv = '1';
    return this.apiService.postQuestion(data)
  }

  /**
   * 登録用データを作成する。
   * @param user
   * @param slipNo
   * @param text
   * @returns
   */
  private createQuestion(userId:string, userName:string, slipNo: string, text: string): slipQuestion {
    const data:slipQuestion = {
      id: 0,
      slipNo: slipNo,
      slipAdminUser: '',
      senderId: userId,
      senderName: userName,
      senderText: text,
      anserDiv: '0',
      anserText: '',
      created: '',
      updated: ''
    }
    return data;
  }



}


