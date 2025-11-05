document.addEventListener('DOMContentLoaded', () => {
    const appContainer = document.querySelector('.app-container');

    function setAppHeight() {
        appContainer.style.height = `${window.innerHeight}px`;
    }

    // Set height on initial load and on resize
    setAppHeight();
    window.addEventListener('resize', setAppHeight);

    // Screen elements
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultScreen = document.getElementById('result-screen');

    // Buttons
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');

    // Form selections
    const genderRadios = document.querySelectorAll('input[name="gender"]');
    const ageRadios = document.querySelectorAll('input[name="age"]');

    // Quiz elements
    const progressBar = document.getElementById('progress');
    const questionText = document.getElementById('question-text');
    const answerOptionsContainer = document.getElementById('answer-options');


    const scentName = document.getElementById('scent-name');
    const mbtiTypeDisplay = document.getElementById('mbti-type');
    const scentDescription = document.getElementById('scent-description');
    const resultOilFront = document.getElementById('result-oil-front');
    const resultOilBack = document.getElementById('result-oil-back');

    // Memory Card elements
    const photoUpload = document.getElementById('photo-upload');
    const cardPreviewContainer = document.getElementById('card-preview-container');
    const saveCardBtn = document.getElementById('save-card-btn');
    const canvas = document.getElementById('card-canvas');
    const ctx = canvas.getContext('2d');
    const logoImg = new Image();
    logoImg.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAeAAAAG+CAYAAADjEaSoAAAAAXNSR0IArs4c6QAAABxpSURBVHic7cExAQAAAMKg9U9tCU+gAAAAAAAAAAAAAADg3w0YgAAB50m63gAAAABJRU5ErkJggg=='; // Embed logo as Base64

    // Scores toggle elements
    const toggleScoresBtn = document.getElementById('toggle-scores-btn');
    const scoresCollapsible = document.getElementById('scores-collapsible');

    let userGender = null;
    let userAge = null;
    let currentQuestionIndex = 0;
    let scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    let activeQuestionSet = [];

    const scents = {
        '백화산': {
            desc: {
                INTJ: '계획적이고 깊은 사고를 하는 당신에게, 백화산의 맑은 공기는 생각의 숲을 정리해주는 향기입니다. 레몬과 편백의 투명한 향이 집중을 돕고 머리를 맑게 비워줍니다.',
                ESFP: '감각적이고 자유로운 당신에게, 유칼립투스와 편백의 상쾌함이 에너지를 충전시킵니다. 마치 숲 속에서 맞는 이른 아침의 공기처럼 활력을 선사합니다.'
            }
        },
        '안흥진성': {
            desc: {
                ESTJ: '분명하고 책임감 있는 당신에게, 바다의 바람 같은 페퍼민트 향이 머리를 맑게 하고 선명한 결단의 순간을 만들어 줍니다.',
                INFP: '이상과 감정을 중시하는 당신에게, 프랑킨센스와 베르가못이 내면의 에너지를 깨워 흔들리는 마음을 다독이고 방향을 찾아줍니다.',
                INTP: '논리적이고 분석적인 당신에게, 안흥진성의 시원한 바닷바람은 복잡한 생각을 정리하고 새로운 통찰을 얻게 합니다. 명료한 사고를 돕는 향기입니다.'
            }
        },
        '안면송림': {
            desc: {
                ISFJ: '따뜻하고 배려 깊은 당신에게, 소나무 숲의 잔잔한 향이 마음의 안식을 선물합니다. 피톤치드의 부드러운 울림이 하루를 다독여줍니다.',
                ENTP: '창의적이고 도전적인 당신에게, 베티버와 샌달우드의 깊은 향이 산만한 생각을 정리하고 새로운 아이디어의 리듬을 만들어줍니다.'
            }
        },
        '만리포': {
            desc: {
                ENFJ: '따뜻한 리더십을 가진 당신에게, 유자와 만다린의 감귤 향이 사람과의 연결을 부드럽게 합니다. 노을빛처럼 마음을 포근히 덮어주는 향기입니다.',
                ISTP: '논리적이지만 감각적인 당신에게, 자몽의 산뜻함이 감정을 가볍게 터치해줍니다. 저녁 바람처럼 다가오는 향이 짧은 쉼표가 되어줍니다.'
            }
        },
        '신두사구': {
            desc: {
                ISFP: '예술적 감성이 풍부한 당신에게, 프랑킨센스와 샌달우드의 조화가 내면의 감정을 부드럽게 열어줍니다. 따뜻한 모래 위에서 깊게 숨쉬는 순간의 향기입니다.',
                ENTJ: '결단력 있고 비전을 추구하는 당신에게, 샌달우드의 무게감과 클로브의 따뜻함이 중심을 잡아줍니다. 고요한 사구 위, 내면의 질서를 세우는 향입니다.'
            }
        },
        '가의도': {
            desc: {
                ENFP: '영감이 넘치는 당신에게, 자스민과 오렌지의 향이 햇살처럼 긍정 에너지를 채워줍니다. 세상을 향해 웃을 힘을 주는 향기입니다.',
                ISTJ: '성실하고 실용적인 당신에게, 바닐라와 네롤리의 은은한 조화가 일상에 정돈된 쉼을 줍니다. 반복되는 하루 속에서도 안정감을 찾게 하는 향입니다.'
            }
        },
        '몽산해변': {
            desc: {
                INFJ: '깊이 있는 통찰과 감성을 가진 당신에게, 라벤더와 네롤리가 마음의 파도를 잠재워 줍니다. 조용한 밤, 자신을 회복시키는 향기입니다.',
                ESTP: '즉흥적이고 감각적인 당신에게, 라벤더와 페퍼민트의 조화가 정신을 쉬게 합니다. 바쁜 하루 속 잠깐의 정지 버튼 같은 향입니다.'
            }
        },
        '할미·할아비바위': {
            desc: {
                INFP: '감성이 풍부한 당신에게, 로즈와 오스만투스의 달콤한 향이 오래된 사랑처럼 따뜻하게 스며듭니다. 감정을 안아주는 부드러운 위로의 향입니다.',
                ESTP: '열정적이고 매력적인 당신에게, 제라늄과 일랑일랑의 관능적인 조화가 감정의 균형을 맞춰줍니다. 사랑과 자유를 동시에 표현하는 향입니다.'
            }
        }
    };

    const mbtiScentMapping = {
        INTJ: '백화산', ESFP: '백화산',
        INFP: '안흥진성', ESTP: '할미·할아비바위',
        ESTJ: '안흥진성', INTP: '안흥진성',
        ISFJ: '안면송림', ENTP: '안면송림',
        ENFJ: '만리포', ISTP: '만리포',
        ISFP: '신두사구', ENTJ: '신두사구',
        ENFP: '가의도', ISTJ: '가의도',
        INFJ: '몽산해변', ESFJ: '몽산해변'
    };

    const questions = {
        tens: {
            male: [
                { q: '주말에 친구들과 PC방에 갔다. 나는 주로 어떤 역할을 맡나?', a: [{t:'새로운 친구들을 사귀며 팀의 분위기를 주도한다', v:'E'}, {t:'조용히 내 게임에 집중하며 실력을 뽐낸다', v:'I'}, {t:'팀의 전략을 짜고 승리를 위해 오더를 내린다', v:'J'}, {t:'예상치 못한 플레이로 변수를 만들며 즐겜한다', v:'P'}] },
                { q: '친구가 새로 나온 운동화를 자랑한다. 나의 반응은?', a: [{t:'"오, 그거 어디서 샀어? 얼마야?" 구체적인 정보를 묻는다', v:'S'}, {t:'"진짜 예쁘다! 너한테 완전 잘 어울려!" 친구의 기분에 공감한다', v:'F'}, {t:'"그 돈이면 차라리 다른 걸 사지 그랬어" 나의 의견을 솔직하게 말한다', v:'T'}, {t:'저 운동화를 신으면 어떤 코디를 할 수 있을지 상상해본다', v:'N'}] },
                { q: '체육 시간에 팀을 짜서 축구를 한다. 나는?', a: [{t:'적극적으로 공을 쫓아다니며 경기를 주도한다', v:'E'}, {t:'골대 앞에서 기회를 노리거나, 수비에 집중한다', v:'I'}, {t:'우리 팀의 전력을 분석하고 포지션을 정한다', v:'J'}, {t:'상대 팀의 허를 찌르는 창의적인 플레이를 시도한다', v:'P'}] },
                { q: '유튜브에서 새로운 채널을 구독한다면, 어떤 채널을 선택할까?', a: [{t:'실제 경험을 바탕으로 한 유용한 정보를 주는 채널', v:'S'}, {t:'미래 기술이나 과학 이론을 알기 쉽게 설명해주는 채널', v:'N'}, {t:'친구들과 함께 보고 웃을 수 있는 재미있는 채널', v:'F'}, {t:'논리적인 분석으로 사건이나 인물을 파헤치는 채널', v:'T'}] },
                { q: '시험이 끝난 주말, 나는 무엇을 하고 싶나?', a: [{t:'친구들과 만나 신나게 논다', v:'E'}, {t:'집에서 혼자 게임을 하거나 영화를 보며 쉰다', v:'I'}, {t:'미리 세워둔 계획대로 밀린 취미 활동을 한다', v:'J'}, {t:'그날의 기분에 따라 즉흥적으로 하고 싶은 것을 한다', v:'P'}] },
                { q: '장래 희망에 대해 부모님과 이야기한다면?', a: [{t:'현실적으로 가능한 직업과 안정적인 미래에 대해 이야기한다', v:'S'}, {t:'내가 꿈꾸는 미래의 모습과 비전에 대해 이야기한다', v:'N'}, {t:'부모님의 의견을 존중하고 설득하기 위해 노력한다', v:'F'}, {t:'나의 논리와 객관적인 근거로 부모님을 설득한다', v:'T'}] },
                { q: '새로운 게임을 시작했다. 나의 플레이 스타일은?', a: [{t:'공략집을 보며 가장 효율적인 루트로 플레이한다', v:'J'}, {t:'일단 부딪혀보며 나만의 방식으로 플레이한다', v:'P'}, {t:'게임의 스토리를 중시하며 천천히 음미한다', v:'N'}, {t:'빠른 레벨업과 아이템 획득에 집중한다', v:'S'}] },
                { q: '친구가 약속 시간에 늦는다고 연락이 왔다. 나는?', a: [{t:'"알았어" 라고 답하고 PC방에서 한 판 더 한다', v:'P'}, {t:'"언제쯤 올 수 있는데?" 정확한 시간을 확인한다', v:'J'}, {t:'"무슨 일 있어? 괜찮아?" 친구를 걱정한다', v:'F'}, {t:'기다리는 동안 다른 친구에게 연락하거나 다른 할 일을 찾는다', v:'T'}] }
            ],
            female: [
                { q: '학교 축제 준비를 한다면, 나는 어떤 역할을 맡고 싶어?', a: [{t:'친구들과 함께 부스를 운영하며 손님을 맞이하는 역할', v:'E'}, {t:'축제 포스터나 부스 디자인을 기획하는 역할', v:'I'}, {t:'축제 전체의 프로그램을 짜고 일정을 관리하는 역할', v:'J'}, {t:'새로운 아이디어를 내서 독특한 이벤트를 제안하는 역할', v:'P'}] },
                { q: '친한 친구가 갑자기 "나 요즘 너무 우울해" 라고 말한다면?', a: [{t:'"왜? 무슨 일 있었어?" 구체적인 상황을 물어본다', v:'S'}, {t:'"힘들었겠다.." 말없이 안아주며 위로한다', v:'F'}, {t:'"병원에 가보는 건 어때?" 현실적인 해결책을 제시한다', v:'T'}, {t:'친구가 우울한 이유에 대해 여러 가능성을 상상해본다', v:'N'}] },
                { q: '새 학기, 새로운 친구를 사귈 때 나는?', a: [{t:'먼저 다가가서 말을 걸고 인사를 건넨다', v:'E'}, {t:'누군가 말을 걸어주기를 기다리는 편이다', v:'I'}, {t:'나와 잘 맞을 것 같은 친구를 신중하게 관찰한다', v:'J'}, {t:'자연스럽게 친해질 기회를 기다린다', v:'P'}] },
                { q: '내가 좋아하는 아이돌의 컴백! 나는 어떻게 반응할까?', a: [{t:'컴백 날짜에 맞춰 앨범을 사고 스밍을 돌린다', v:'S'}, {t:'이번 앨범의 컨셉과 세계관을 깊이 파고든다', v:'N'}, {t:'"이번 컨셉 정말 최고다!" 친구들에게 알리고 함께 이야기한다', v:'F'}, {t:'수록곡의 가사와 멜로디를 분석하고 평가한다', v:'T'}] },
                { q: '주말에 혼자만의 시간이 생겼다. 무엇을 할까?', a: [{t:'평소 가고 싶었던 카페에 가서 디저트를 즐긴다', v:'S'}, {t:'상상력을 발휘하여 소설이나 그림을 창작한다', v:'N'}, {t:'혼자만의 시간을 즐기며 조용히 휴식한다', v:'I'}, {t:'친구에게 연락해서 약속을 잡는다', v:'E'}] },
                { q: '팀 프로젝트 발표 준비를 할 때, 나는?', a: [{t:'발표 자료의 디자인과 시각적 효과에 집중한다', v:'S'}, {t:'발표의 전체적인 흐름과 논리적인 구조를 짠다', v:'N'}, {t:'팀원들의 의견을 조율하고 발표를 순조롭게 이끈다', v:'F'}, {t:'발표 내용의 사실관계와 정확성을 꼼꼼히 확인한다', v:'T'}] },
                { q: '옷을 사러 쇼핑몰에 갔다. 나의 선택은?', a: [{t:'미리 정해둔 스타일과 예산에 맞춰 옷을 고른다', v:'J'}, {t:'돌아다니다가 마음에 드는 옷이 보이면 즉흥적으로 산다', v:'P'}, {t:'요즘 유행하는 스타일의 옷을 먼저 찾아본다', v:'S'}, {t:'나만의 개성을 표현할 수 있는 독특한 디자인의 옷을 찾는다', v:'N'}] },
                { q: '친구가 약속 시간에 늦는다고 연락이 왔다. 나는?', a: [{t:'"괜찮아, 천천히 와" 라고 말하고 다른 볼일을 본다', v:'P'}, {t:'"언제쯤 도착할 것 같아?" 예상 시간을 확인한다', v:'J'}, {t:'기다리는 동안 친구에게 무슨 일이 있는지 걱정한다', v:'F'}, {t:'기다리는 시간을 활용하여 주변을 구경하거나 다른 계획을 세운다', v:'T'}] }
            ]
        },
        twentiesThirties: {
            male: [
                { q: '회사 동료가 회식 장소로 시끄러운 술집과 조용한 와인바 중 어디로 갈지 묻는다. 당신의 선택은?', a: [{t:'당연히 시끌벅적한 술집에서 다 같이 신나게 놀아야지!', v:'E'}, {t:'조용한 와인바에서 소수의 동료와 깊은 대화를 나누고 싶어', v:'I'}, {t:'회식의 목적과 참석자들의 성향을 고려해서 장소를 정하자고 제안한다', v:'J'}, {t:'일단 아무데나 가서 분위기 보고 재밌게 놀면 되지!', v:'P'}] },
                { q: '연인과의 기념일, 무엇을 할까?', a: [{t:'미리 예약한 레스토랑에서 근사한 저녁을 먹는다', v:'S'}, {t:'두 사람만의 특별한 의미가 담긴 장소에 간다', v:'N'}, {t:'연인이 무엇을 원하는지 물어보고 함께 계획한다', v:'F'}, {t:'내가 생각하는 최고의 데이트 코스를 준비해서 연인을 놀라게 한다', v:'T'}] },
                { q: '주말에 혼자만의 시간이 생겼다. 나는 무엇을 할까?', a: [{t:'평소에 가보고 싶었던 맛집을 찾아가거나 새로운 취미에 도전한다', v:'S'}, {t:'미래에 대한 계획을 세우거나 자기계발을 위한 공부를 한다', v:'N'}, {t:'친구들을 만나거나 동호회 활동에 참여한다', v:'E'}, {t:'집에서 편안하게 쉬면서 영화를 보거나 게임을 한다', v:'I'}] },
                { q: '친구가 사업 아이템이 있다며 함께 하자고 제안한다. 나의 반응은?', a: [{t:'"어떤 아이템인데? 구체적으로 설명해봐" 사업 계획을 꼼꼼히 따져본다', v:'T'}, {t:'"재밌겠다! 우리 함께라면 뭐든 할 수 있을 거야!" 친구의 열정에 공감한다', v:'F'}, {t:'시장의 성장 가능성과 미래 비전을 먼저 본다', v:'N'}, {t:'실패할 경우의 리스크와 현실적인 자금 계획을 먼저 생각한다', v:'S'}] },
                { q: '소개팅에 나갔다. 상대방이 마음에 들지 않을 때 나는?', a: [{t:'최대한 예의를 지키며 대화를 이어나가고 조용히 마무리한다', v:'F'}, {t:'시간 낭비라고 생각하고 솔직하게 말한 뒤 먼저 일어선다', v:'T'}, {t:'혹시 다른 매력이 있을지도 모른다고 생각하며 대화를 더 나눠본다', v:'P'}, {t:'애프터 신청은 하지 않겠다고 미리 마음속으로 결정한다', v:'J'}] },
                { q: '자동차를 새로 사려고 한다. 나의 선택 기준은?', a: [{t:'디자인과 성능, 연비 등 구체적인 스펙을 비교 분석한다', v:'S'}, {t:'이 차가 나에게 어떤 새로운 경험과 라이프스타일을 가져다줄지 상상한다', v:'N'}, {t:'다른 사람들의 시선과 나의 사회적 지위를 고려하여 선택한다', v:'E'}, {t:'나의 개성과 가치관을 표현할 수 있는 차를 선택한다', v:'I'}] },
                { q: '여행을 떠난다면, 어떤 스타일의 여행을 선호하나?', a: [{t:'미리 짜놓은 계획에 따라 움직이는 안정적인 여행', v:'J'}, {t:'아무런 계획 없이 즉흥적으로 떠나는 자유로운 여행', v:'P'}, {t:'휴양지에서 편안하게 쉬면서 재충전하는 여행', v:'I'}, {t:'다양한 사람들을 만나고 새로운 문화를 경험하는 여행', v:'E'}] },
                { q: '업무 처리 방식에서 동료와 갈등이 생겼다. 나는?', a: [{t:'객관적인 데이터와 사실을 근거로 동료를 설득한다', v:'T'}, {t:'동료의 입장을 먼저 들어보고 감정적인 부분을 공감해준다', v:'F'}, {t:'일단 동료의 방식대로 진행해보고 문제점을 파악한다', v:'P'}, {t:'두 가지 방식의 장단점을 분석하고 최상의 합의점을 찾는다', v:'J'}] }
            ],
            female: [
                { q: '친구가 소개팅을 시켜준다고 한다. 나의 선택은?', a: [{t:'새로운 사람을 만나는 건 언제나 설레! 좋아!', v:'E'}, {t:'모르는 사람과 만나는 건 좀 부담스러운데..', v:'I'}, {t:'소개팅 전에 상대방의 프로필을 꼼꼼히 확인한다', v:'J'}, {t:'어떤 사람이 나올까? 재밌는 경험이 될 것 같아', v:'P'}] },
                { q: '회사에서 새로운 프로젝트를 맡게 되었다. 나는?', a: [{t:'프로젝트의 목표와 현실적인 실행 계획을 먼저 세운다', v:'S'}, {t:'이 프로젝트가 회사에 어떤 비전을 제시할 수 있을지 고민한다', v:'N'}, {t:'팀원들의 의견을 듣고 다 함께 으쌰으쌰하며 시작한다', v:'F'}, {t:'프로젝트의 문제점을 분석하고 가장 효율적인 방법을 찾는다', v:'T'}] },
                { q: '주말에 약속이 취소되었다. 나는 무엇을 할까?', a: [{t:'바로 다른 친구에게 연락해서 약속을 잡는다', v:'E'}, {t:'오예! 집에서 혼자만의 시간을 즐긴다', v:'I'}, {t:'미리 세워둔 다른 계획을 실행한다', v:'J'}, {t:'그날의 기분에 따라 즉흥적으로 하고 싶은 일을 한다', v:'P'}] },
                { q: '친구가 연인과 헤어져서 힘들어한다. 나의 위로 방식은?', a: [{t:'친구가 힘든 감정을 털어놓을 수 있도록 계속 옆에서 들어준다', v:'F'}, {t:'"왜 헤어졌어?" 구체적인 상황을 듣고 해결책을 찾아준다', v:'T'}, {t:'"시간이 약이야. 더 좋은 사람 만날 수 있을 거야" 라고 위로한다', v:'N'}, {t:'친구와 함께 맛있는 음식을 먹거나 쇼핑을 하며 기분을 풀어준다', v:'S'}] },
                { q: '인테리어를 바꾸고 싶다. 나의 스타일은?', a: [{t:'요즘 유행하는 스타일의 가구와 소품을 찾아본다', v:'S'}, {t:'나만의 취향과 스토리가 담긴 공간으로 꾸민다', v:'N'}, {t:'사람들을 초대해서 파티를 열고 싶은 아늑한 공간으로 만든다', v:'E'}, {t:'혼자만의 휴식을 위한 편안하고 조용한 공간으로 만든다', v:'I'}] },
                { q: '이직을 준비한다면, 가장 중요하게 생각하는 것은?', a: [{t:'회사의 안정성과 연봉, 복지 혜택', v:'S'}, {t:'나의 성장을 돕고 비전을 함께할 수 있는 회사', v:'N'}, {t:'수평적이고 자유로운 분위기의 동료들', v:'F'}, {t:'나의 능력을 인정받고 성과를 낼 수 있는 곳', v:'T'}] },
                { q: '여행을 떠난다면, 어떤 스타일의 여행을 선호하나?', a: [{t:'맛집, 쇼핑, 관광 명소를 모두 즐기는 알찬 여행', v:'J'}, {t:'발길 닿는 대로, 마음 가는 대로 떠나는 자유로운 여행', v:'P'}, {t:'현지인처럼 살아보는 감성적인 여행', v:'N'}, {t:'다양한 액티비티를 즐기는 역동적인 여행', v:'S'}] },
                { q: '친구가 나의 단점을 이야기한다면, 나의 반응은?', a: [{t:'"내가 그랬어? 몰랐네" 일단 수긍하고 고치려고 노력한다', v:'F'}, {t:'"너는 안 그래?" 라며 친구의 단점도 이야기한다', v:'T'}, {t:'나의 행동을 되돌아보며 왜 그런 말을 했는지 생각해본다', v:'I'}, {t:'"그럴 수도 있지!" 쿨하게 넘기고 다른 이야기를 시작한다', v:'E'}] }
            ]
        },
        fortiesFifties: {
            male: [
                { q: '회사에서 중요한 프로젝트를 이끌게 되었다. 나의 리더십 스타일은?', a: [{t:'팀원들의 의견을 경청하고 모두가 만족하는 방향으로 이끈다', v:'F'}, {t:'강력한 추진력과 논리로 팀을 이끌어 목표를 달성한다', v:'T'}, {t:'팀원들이 스스로의 역량을 발휘할 수 있도록 믿고 맡긴다', v:'P'}, {t:'명확한 목표와 계획을 제시하고 체계적으로 관리한다', v:'J'}] },
                { q: '요즘 건강에 부쩍 관심이 많아졌다. 어떤 건강 관리 방식을 선호하나?', a: [{t:'매일 아침 조깅을 하거나 헬스장에서 꾸준히 운동한다', v:'S'}, {t:'명상이나 요가를 통해 몸과 마음의 균형을 찾는다', v:'N'}, {t:'등산 동호회에 가입해서 사람들과 함께 운동을 즐긴다', v:'E'}, {t:'혼자 조용히 산책하며 생각을 정리하는 시간을 갖는다', v:'I'}] },
                { q: '자녀가 비현실적인 꿈을 꾼다고 말한다면?', a: [{t:'"현실적으로 생각해야지" 라고 조언하며 안정적인 길을 제안한다', v:'S'}, {t:'"멋진 꿈이네!" 라고 격려하며 꿈을 이룰 수 있는 다양한 가능성을 이야기해준다', v:'N'}, {t:'자녀의 마음을 다치지 않게 돌려 말하며 현실적인 대안을 함께 찾아본다', v:'F'}, {t:'꿈을 이루기 위한 구체적인 계획과 논리적인 근거를 가져오라고 말한다', v:'T'}] },
                { q: '은퇴 후, 가장 하고 싶은 것은 무엇인가?', a: [{t:'전원주택을 짓고 텃밭을 가꾸며 자연과 함께 살고 싶다', v:'S'}, {t:'세계 일주를 하거나 새로운 분야의 공부를 시작하고 싶다', v:'N'}, {t:'가족이나 친구들과 더 많은 시간을 보내고 싶다', v:'E'}, {t:'평생의 경험을 담은 책을 쓰거나 나만의 작업실을 갖고 싶다', v:'I'}] },
                { q: '오랜만에 만난 친구가 힘든 이야기를 털어놓는다. 나는?', a: [{t:'"힘들었겠다" 라고 말하며 친구의 감정에 깊이 공감한다', v:'F'}, {t:'문제의 원인을 분석하고 현실적인 해결책을 제시한다', v:'T'}, {t:'나의 경험에 빗대어 구체적인 조언을 해준다', v:'S'}, {t:'친구가 스스로 문제를 해결할 수 있도록 믿고 기다려준다', v:'N'}] },
                { q: '부부 동반 모임에 나갔다. 나는 주로 어떻게 행동하나?', a: [{t:'새로운 사람들과 적극적으로 어울리며 대화를 주도한다', v:'E'}, {t:'아내의 옆을 지키며 조용히 미소만 짓는다', v:'I'}, {t:'모임의 분위기를 살피며 모든 사람이 즐거운 시간을 보낼 수 있도록 돕는다', v:'F'}, {t:'관심 있는 주제에 대해 논리적으로 이야기하며 토론을 즐긴다', v:'T'}] },
                { q: '나에게 휴식이란?', a: [{t:'아무것도 하지 않고 멍하니 있거나 잠을 자는 것', v:'P'}, {t:'평소에 하고 싶었던 취미 활동을 하거나 여행을 떠나는 것', v:'J'}, {t:'사랑하는 사람들과 맛있는 음식을 먹으며 이야기하는 것', v:'E'}, {t:'혼자만의 공간에서 좋아하는 책을 읽거나 영화를 보는 것', v:'I'}] },
                { q: '다시 태어난다면, 어떤 삶을 살고 싶나?', a: [{t:'지금과 비슷한 안정적인 삶', v:'S'}, {t:'지금과는 전혀 다른 새로운 도전으로 가득한 삶', v:'N'}, {t:'더 많은 사람들에게 사랑받고 인정받는 삶', v:'F'}, {t:'나의 분야에서 최고의 전문가가 되어 세상을 바꾸는 삶', v:'T'}] }
            ],
            female: [
                { q: '자녀 혹은 가까운 후배가 중요한 결정을 앞두고 조언을 구한다면?', a: [{t:'나의 경험을 바탕으로 현실적인 조언을 해준다', v:'S'}, {t:'스스로의 가능성을 믿고 도전해 보라고 격려한다', v:'N'}, {t:'따뜻한 말로 위로하며 그들의 선택을 지지해준다', v:'F'}, {t:'문제의 핵심을 파악하고 논리적인 해결책을 제시한다', v:'T'}] },
                { q: '오랜만에 생긴 휴일, 어떻게 보내고 싶으신가요?', a: [{t:'가족이나 친구들과 함께 즐거운 시간을 보낸다', v:'E'}, {t:'혼자만의 시간을 가지며 조용히 재충전한다', v:'I'}, {t:'미리 계획해 둔 여행을 떠나거나 새로운 것을 배운다', v:'J'}, {t:'그날의 기분에 따라 발길 닿는 대로 움직인다', v:'P'}] },
                { q: '건강을 위해 새로운 운동을 시작하려고 한다. 나의 선택은?', a: [{t:'요가나 필라테스처럼 차분하고 꾸준히 할 수 있는 운동', v:'I'}, {t:'에어로빅이나 댄스 스포츠처럼 사람들과 함께 즐길 수 있는 운동', v:'E'}, {t:'운동 효과가 확실하고 눈에 보이는 성과가 있는 운동', v:'S'}, {t:'운동을 통해 새로운 삶의 활력과 의미를 찾을 수 있는 운동', v:'N'}] },
                { q: '친구가 큰 돈을 빌려달라고 부탁한다면?', a: [{t:'친구와의 관계를 생각해서 일단 빌려준다', v:'F'}, {t:'빌려주기 전에 친구의 상황과 상환 계획을 꼼꼼히 따져본다', v:'T'}, {t:'내가 감당할 수 있는 현실적인 금액만 빌려준다', v:'S'}, {t:'친구가 돈을 빌려야 하는 근본적인 이유에 대해 함께 고민해준다', v:'N'}] },
                { q: '나의 은퇴 후 삶을 상상해 본다면?', a: [{t:'구체적인 계획을 세우고 안정적인 노후를 준비한다', v:'J'}, {t:'그때 가봐서 마음 가는 대로 자유롭게 살고 싶다', v:'P'}, {t:'가족들과 함께 시간을 보내거나 봉사활동을 하고 싶다', v:'F'}, {t:'평생 하고 싶었던 공부나 취미활동에 도전하고 싶다', v:'T'}] },
                { q: '오랜만에 만난 친구들과의 대화에서 나는 주로?', a: [{t:'주로 대화를 주도하며 분위기를 이끈다', v:'E'}, {t:'다른 사람들의 이야기를 들어주는 편이다', v:'I'}, {t:'친구들의 고민을 들어주고 진심으로 공감해준다', v:'F'}, {t:'객관적인 사실을 바탕으로 명확하게 의견을 말한다', v:'T'}] },
                { q: '자녀의 교육 문제로 남편과 의견이 다르다면?', a: [{t:'남편의 의견을 존중하고 대화를 통해 합의점을 찾는다', v:'F'}, {t:'아이의 미래를 위해 무엇이 최선인지 논리적으로 설득한다', v:'T'}, {t:'다양한 교육 정보를 찾아보고 최선의 대안을 제시한다', v:'S'}, {t:'아이가 스스로의 길을 찾을 수 있도록 믿고 기다려주자고 설득한다', v:'N'}] },
                { q: '나를 위한 소비를 한다면, 어떤 물건을 사고 싶나?', a: [{t:'오랫동안 사용할 수 있는 실용적이고 질 좋은 물건', v:'S'}, {t:'나의 가치와 신념을 나타낼 수 있는 의미 있는 물건', v:'N'}, {t:'나의 기분을 좋게 만들어주는 예쁘고 감성적인 물건', v:'F'}, {t:'나의 지적 호기심을 채워주는 책이나 강좌', v:'T'}] }
            ]
        },
        senior: {
            male: [
                { q: '새로운 기술(스마트폰, 키오스크 등)을 배우는 것에 거부감이 없다.', a: [{t:'네', v:'N'}, {t:'아니오', v:'S'}] },
                { q: '친구들과의 약속을 내가 먼저 주도해서 잡는 편이다.', a: [{t:'네', v:'E'}, {t:'아니오', v:'I'}] },
                { q: '결정을 내릴 때, 다른 사람의 의견보다는 나의 경험과 판단을 더 믿는다.', a: [{t:'네', v:'T'}, {t:'아니오', v:'F'}] },
                { q: '과거의 경험을 되돌아보고 교훈을 얻는 것을 중요하게 생각한다.', a: [{t:'네', v:'S'}, {t:'아니오', v:'N'}] },
                { q: '하루 일과를 미리 정해두고 규칙적으로 생활하는 것을 선호한다.', a: [{t:'네', v:'J'}, {t:'아니오', v:'P'}] }
            ],
            female: [
                { q: '손주 혹은 어린 아이들과 함께 시간을 보내는 것을 즐긴다.', a: [{t:'네', v:'F'}, {t:'아니오', v:'T'}] },
                { q: '여행을 갈 때, 새로운 장소보다는 익숙하고 편안한 곳이 더 좋다.', a: [{t:'네', v:'S'}, {t:'아니오', v:'N'}] },
                { q: '단체 활동보다는 혼자서 하는 취미(뜨개질, 독서 등)를 더 선호한다.', a: [{t:'네', v:'I'}, {t:'아니오', v:'E'}] },
                { q: '어떤 일이든 미리 계획을 세우고 그대로 실천해야 마음이 편하다.', a: [{t:'네', v:'J'}, {t:'아니오', v:'P'}] },
                { q: '다른 사람의 부탁을 거절하는 것을 어려워한다.', a: [{t:'네', v:'F'}, {t:'아니오', v:'T'}] }
            ]
        }
    };

    // --- Event Listeners ---

    function checkSelections() {
        if (userGender && userAge) {
            startBtn.disabled = false;
        }
    }

    genderRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            userGender = document.querySelector('input[name="gender"]:checked').value;
            checkSelections();
        });
    });

    ageRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            userAge = document.querySelector('input[name="age"]:checked').value;
            checkSelections();
        });
    });

    startBtn.addEventListener('click', () => {
        let ageGroup;
        switch (userAge) {
            case '10s':
                ageGroup = 'tens';
                break;
            case '20s':
            case '30s':
                ageGroup = 'twentiesThirties';
                break;
            case '40s':
            case '50s':
                ageGroup = 'fortiesFifties';
                break;
            case '60s+':
                ageGroup = 'senior';
                break;
            default:
                ageGroup = 'twentiesThirties'; // Default case
        }

        if (questions[ageGroup] && questions[ageGroup][userGender]) {
            activeQuestionSet = questions[ageGroup][userGender];
        } else {
            // Fallback to a default question set if the specific one doesn't exist
            activeQuestionSet = questions.twentiesThirties.male;
        }
        
        switchScreen(startScreen, quizScreen);
        displayQuestion();
    });

    restartBtn.addEventListener('click', () => {
        resetQuiz();
        switchScreen(resultScreen, startScreen);
    });

    photoUpload.addEventListener('change', handlePhotoUpload);
    saveCardBtn.addEventListener('click', saveCard);

    toggleScoresBtn.addEventListener('click', () => {
        const isHidden = scoresCollapsible.style.display === 'none';
        scoresCollapsible.style.display = isHidden ? 'block' : 'none';
        toggleScoresBtn.textContent = isHidden ? '숨기기' : '자세히 보기';
    });

    // --- Functions ---

    function switchScreen(from, to) {
        from.classList.remove('active');
        to.classList.add('active');
    }

    function handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const userImage = new Image();
            userImage.onload = () => {
                document.fonts.ready.then(() => {
                    generateCard(userImage);
                });
            };
            userImage.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

            function generateCard(userImg) {

                canvas.style.backgroundColor = '#FDFBF7'; // Explicitly set canvas background style

                // Set canvas dimensions (9:16 aspect ratio)

                canvas.width = 750;

                canvas.height = 1334;

        

                // --- 1. Draw Cream Background for the Card ---

                ctx.fillStyle = '#FDFBF7'; // Cream background

                ctx.fillRect(0, 0, canvas.width, canvas.height);

        

                // --- Global Vertical Shift ---

                const topMargin = 60; // Increase this value to move everything down

                ctx.translate(0, topMargin);

        

                // --- 2. Draw User's Photo in a Circle ---

                ctx.save(); // Save the current state

                const circle = {

                    x: canvas.width / 2,

                    y: 400, // Base Y position

                    radius: 200

                };

                ctx.beginPath();

                ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, true);

                ctx.closePath();

                ctx.clip(); // Create a circular clipping path

        

                // ... (The rest of the photo drawing logic is the same) ...

                const userAspect = userImg.width / userImg.height;

                const circleAspect = 1;

                let sx, sy, sWidth, sHeight;

                if (userAspect > circleAspect) {

                    sHeight = userImg.height;

                    sWidth = sHeight;

                    sx = (userImg.width - sWidth) / 2;

                    sy = 0;

                } else {

                    sWidth = userImg.width;

                    sHeight = sWidth;

                    sx = 0;

                    sy = (userImg.height - sHeight) / 2;

                }

                ctx.drawImage(userImg, sx, sy, sWidth, sHeight, circle.x - circle.radius, circle.y - circle.radius, circle.radius * 2, circle.radius * 2);

                ctx.beginPath();

                ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, true);

                ctx.lineWidth = 10;

                ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';

                ctx.stroke();

                ctx.restore();

        

                // --- 3. Draw Logo Text ---

                ctx.fillStyle = '#003f5c'; // Company brand color

                ctx.font = 'bold 80px Inter, Noto Sans KR';

                ctx.textAlign = 'center';

                ctx.fillText('T8', canvas.width / 2, 120);

                ctx.font = '50px Inter, Noto Sans KR';

                ctx.fillText('AROMA', canvas.width / 2, 180);

        

                // --- 4. Draw MBTI & Scent Text ---

                const mbtiResult = mbtiTypeDisplay.textContent;

                const finalScentName = scentName.textContent;

                const scentDescriptionText = scentDescription.textContent;

        

                ctx.fillStyle = '#003f5c'; // Unify color to brand color

                ctx.textAlign = 'center';

                

                // --- Decorative Lines ---

                const lineY = circle.y + circle.radius + 60;

                ctx.fillStyle = '#D3CFC4'; // A soft, elegant color for the lines

                ctx.fillRect(canvas.width / 2 - 150, lineY, 300, 1); // Line above MBTI

        

                ctx.fillStyle = '#003f5c'; // Unify color to brand color

                ctx.font = 'bold 90px Noto Sans KR'; // Reduced font size

                ctx.fillText(mbtiResult, canvas.width / 2, lineY + 100);

        

                ctx.fillRect(canvas.width / 2 - 150, lineY + 140, 300, 1); // Line below MBTI

        

                ctx.font = '45px Noto Sans KR';

                ctx.fillText('당신을 위한 향기', canvas.width / 2, lineY + 210);

        

                ctx.font = 'bold 65px Noto Sans KR'; // Reduced font size

                ctx.fillText(finalScentName, canvas.width / 2, lineY + 300);

        

                // Draw scent description

                ctx.font = '30px Noto Sans KR';

                const maxWidth = canvas.width - 100;

                const lineHeight = 45;

                let y = lineY + 370;

        

                const words = scentDescriptionText.split(' ');

                let line = '';

                for (let n = 0; n < words.length; n++) {

                    const testLine = line + words[n] + ' ';

                    const metrics = ctx.measureText(testLine);

                    if (metrics.width > maxWidth && n > 0) {

                        ctx.fillText(line, canvas.width / 2, y);

                        line = words[n] + ' ';

                        y += lineHeight;

                    } else {

                        line = testLine;

                    }

                }

                ctx.fillText(line, canvas.width / 2, y);

        

                // --- 5. Draw Footer Text ---

                ctx.font = 'italic 35px Noto Sans KR';

                ctx.fillStyle = '#666666'; // Gray for footer

                // Adjust Y for global translation

                ctx.fillText('A Scented Memory from Taean', canvas.width / 2, canvas.height - 60 - topMargin);

        

                // --- 6. Draw Card Border ---

                ctx.setTransform(1, 0, 0, 1, 0, 0);

                ctx.strokeStyle = '#003f5c';

                ctx.lineWidth = 8;

                ctx.strokeRect(0, 0, canvas.width, canvas.height);

                ctx.strokeStyle = '#D3CFC4'; // Match separator line color

                ctx.lineWidth = 2;

                ctx.setLineDash([10, 10]);

                ctx.strokeRect(15, 15, canvas.width - 30, canvas.height - 30);

                ctx.setLineDash([]);

        

                // --- 7. Enable button and Generate Preview ---

                saveCardBtn.disabled = false;

                cardPreviewContainer.innerHTML = `<img src="${canvas.toDataURL('image/jpeg', 0.9)}" alt="Generated Card Preview">`;

            }

    function saveCard() {
        const link = document.createElement('a');
        link.download = 'My_Taean_Scent_Card.jpg'; // Changed to .jpg
        link.href = canvas.toDataURL('image/jpeg', 0.9); // Changed to image/jpeg
        console.log('Saved card data URL:', link.href);
        link.click();
    }

    function displayQuestion() {
        const question = activeQuestionSet[currentQuestionIndex];
        questionText.textContent = question.q;
        answerOptionsContainer.innerHTML = '';

        question.a.forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer.t;
            button.classList.add('option', 'quiz-option');
            button.addEventListener('click', () => handleAnswer(answer.v));
            answerOptionsContainer.appendChild(button);
        });

        updateProgress();
    }

    function handleAnswer(value) {
        scores[value]++;
        currentQuestionIndex++;

        if (currentQuestionIndex < activeQuestionSet.length) {
            displayQuestion();
        } else {
            displayResult();
            switchScreen(quizScreen, resultScreen);
        }
    }

    function updateProgress() {
        const progress = (currentQuestionIndex / activeQuestionSet.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function calculateMbti() {
        let mbti = '';
        mbti += scores.E > scores.I ? 'E' : 'I';
        mbti += scores.S > scores.N ? 'S' : 'N';
        mbti += scores.T > scores.F ? 'T' : 'F';
        mbti += scores.J > scores.P ? 'J' : 'P';
        return mbti;
    }

    function displayResult() {
        const mbtiResult = calculateMbti();
        const finalScentName = mbtiScentMapping[mbtiResult];
        const scentData = scents[finalScentName];

        mbtiTypeDisplay.textContent = mbtiResult;
        scentName.textContent = finalScentName;
        let selectedDescription = scentData.desc[mbtiResult];
        // Fallback if a specific description for the MBTI is not found in the scentData.desc object
        // This can happen if a scent is mapped to multiple MBTI types, but only one specific description is provided in the Word file.
        // For now, if the specific MBTI description is not found, it will default to a generic message.
        if (!selectedDescription) {
            selectedDescription = '당신의 성향에 어울리는 향기입니다.'; // Generic fallback
        }
        scentDescription.textContent = selectedDescription;


        // Calculate and display scores
        const dichotomyPairs = {
            E: ['E', 'I'], I: ['E', 'I'],
            S: ['S', 'N'], N: ['S', 'N'],
            T: ['T', 'F'], F: ['T', 'F'],
            J: ['J', 'P'], P: ['J', 'P']
        };

        const dichotomies = ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'];
        dichotomies.forEach(dichotomy => {
            const scoreBar = document.getElementById(`score-${dichotomy.toLowerCase()}`);
            const scoreValue = document.getElementById(`score-${dichotomy.toLowerCase()}-value`);
            
            const pair = dichotomyPairs[dichotomy];
            const total = scores[pair[0]] + scores[pair[1]];
            const score = scores[dichotomy];
            
            const percentage = total > 0 ? (score / total) * 100 : 0;
            
            if (scoreBar) {
                scoreBar.style.width = `${percentage}%`;
            }
            if (scoreValue) {
                scoreValue.textContent = `${Math.round(percentage)}%`;
            }
        });
    }

    function resetQuiz() {
        userGender = null;
        userAge = null;
        currentQuestionIndex = 0;
        scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
        activeQuestionSet = [];
        startBtn.disabled = false;
        progressBar.style.width = '0%';
        const checkedRadios = document.querySelectorAll('input[type="radio"]:checked');
        checkedRadios.forEach(radio => {
            radio.checked = false;
        });

        // Reset memory card elements
        cardPreviewContainer.innerHTML = '';
        saveCardBtn.disabled = true;
        if (photoUpload) {
            photoUpload.value = '';
        }

        // Reset scores toggle
        if (scoresCollapsible) {
            scoresCollapsible.style.display = 'none';
        }
        if (toggleScoresBtn) {
            toggleScoresBtn.textContent = '자세히 보기';
        }
    }
});