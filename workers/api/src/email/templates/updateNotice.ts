export interface UpdateNoticeTemplateOptions {
  readonly email: string;
  readonly unsubscribeUrl?: string;
}

export interface EmailTemplateResult {
  readonly subject: string;
  readonly html: string;
  readonly text: string;
}

export function getUpdateNoticeTemplate(options: UpdateNoticeTemplateOptions): EmailTemplateResult {
  const unsubscribeLink = options.unsubscribeUrl || "#";
  const contactEmail = "maumium.service@gmail.com";
  
  const subject = "[마음이음] 정식 오픈 및 주요 업데이트 소식 안내";
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      margin: 0;
      padding: 0;
      background-color: #f9f9f9;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border: 1px solid #e0e0e0;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
    }
    .header {
      background-color: #4f46e5;
      padding: 30px 20px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 30px 20px;
    }
    .content p {
      margin-top: 0;
      margin-bottom: 16px;
      font-size: 15px;
      line-height: 1.7;
    }
    .footer {
      background-color: #f3f4f6;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .footer a {
      color: #4f46e5;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>마음이음</h1>
    </div>
    <div class="content">
      <p>안녕하세요,</p>
      <p>마음이음의 정식 오픈 및 주요 기능 업데이트 소식을 신청해 주신 분들께 관련 소식을 전해드립니다.</p>
      
      <!-- [여기에 업데이트 세부 내용이 들어갈 수 있도록 준비] -->
      <div style="background-color: #f9fafb; border-left: 4px solid #4f46e5; padding: 15px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 0; font-weight: 600; font-size: 14px;">📢 새로운 소식이 준비 중입니다.</p>
        <p style="margin: 5px 0 0 0; font-size: 13px; color: #4b5563;">마음이음의 핵심 기능과 자가진단 리포트 개선 작업이 한창입니다. 정식 출시 때 자세한 안내를 전해 드리겠습니다.</p>
      </div>

      <p>마음이음은 느린 학습자 및 경계선 지능에 대한 자가체크와 전문 리포트를 통해 따뜻한 안내를 드리고자 지속해서 서비스를 개선하고 있습니다.</p>
    </div>
    <div class="footer">
      <p>본 메일은 수신인(${options.email})께서 마음이음 웹사이트에서 직접 오픈/업데이트 알림을 동의 및 신청하셨기에 발송되었습니다.</p>
      <p>더 이상 소식을 받고 싶지 않으신 경우, <a href="${unsubscribeLink}">[수신거부]</a>를 클릭하여 언제든지 중단할 수 있습니다.</p>
      <p>기타 문의사항은 발신처 또는 문의 이메일(<a href="mailto:${contactEmail}">${contactEmail}</a>)로 연락해 주세요.</p>
      <p>© 마음이음. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

  const text = `
[마음이음] 정식 오픈 및 주요 업데이트 소식 안내

안녕하세요,
마음이음의 정식 오픈 및 주요 기능 업데이트 소식을 신청해 주신 분들께 관련 소식을 전해드립니다.

새로운 소식이 준비 중입니다. 마음이음의 핵심 기능과 자가진단 리포트 개선 작업이 완료되는 대로 자세한 안내를 전해 드리겠습니다.

---
본 메일은 수신인(${options.email})께서 마음이음 웹사이트에서 직접 오픈/업데이트 알림을 동의 및 신청하셨기에 발송되었습니다.
더 이상 소식을 받고 싶지 않으신 경우, 아래 링크를 통해 수신거부를 진행해 주세요.
수신거부 링크: ${unsubscribeLink}
문의사항: ${contactEmail}
© 마음이음.
`;

  return { subject, html, text };
}
