import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 데이터베이스 시딩을 시작합니다...');

  // 부서 데이터 생성
  const departments = [
    { name: '기획팀', color: '#1E40AF' }, // Deep Blue
    { name: '디자인팀', color: '#F59E0B' }, // Gold
    { name: '개발팀', color: '#10B981' }, // Green
    { name: '마케팅팀', color: '#EF4444' }, // Red
    { name: '인사팀', color: '#8B5CF6' }, // Purple
    { name: '영업팀', color: '#3B82F6' }, // Blue
  ];

  console.log('📁 부서 생성 중...');
  for (const dept of departments) {
    await prisma.department.upsert({
      where: { name: dept.name },
      update: {},
      create: dept,
    });
  }

  // 샘플 사진 데이터 생성
  const photos = [
    {
      departmentName: '기획팀',
      title: '2024 신규 프로젝트 기획안',
      description: '내년도 핵심 프로젝트에 대한 기획 회의 현장입니다. 모두가 열정적으로 참여하고 있습니다.',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800',
      likeCount: 42,
      viewCount: 156,
      isTopPick: true,
    },
    {
      departmentName: '디자인팀',
      title: 'UI/UX 디자인 워크샵',
      description: '최신 디자인 트렌드를 공유하고 함께 학습하는 워크샵 시간입니다.',
      imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
      likeCount: 68,
      viewCount: 234,
      isTopPick: true,
    },
    {
      departmentName: '개발팀',
      title: '코드 리뷰 세션',
      description: '주간 코드 리뷰를 통해 코드 품질을 향상시키고 있습니다.',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      likeCount: 35,
      viewCount: 198,
      isTopPick: false,
    },
    {
      departmentName: '마케팅팀',
      title: '캠페인 성과 공유',
      description: '최근 진행한 마케팅 캠페인의 놀라운 성과를 팀원들과 공유하는 시간입니다.',
      imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
      likeCount: 51,
      viewCount: 287,
      isTopPick: true,
    },
    {
      departmentName: '인사팀',
      title: '신입사원 환영회',
      description: '새로운 팀원들을 따뜻하게 환영하는 자리를 마련했습니다.',
      imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800',
      likeCount: 89,
      viewCount: 412,
      isTopPick: false,
    },
    {
      departmentName: '영업팀',
      title: '분기 목표 달성 축하',
      description: '팀원들의 노력으로 분기 목표를 초과 달성했습니다!',
      imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800',
      likeCount: 73,
      viewCount: 345,
      isTopPick: true,
    },
    {
      departmentName: '디자인팀',
      title: '창의적인 브레인스토밍',
      description: '자유로운 분위기에서 창의적인 아이디어들이 쏟아져 나왔습니다.',
      imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
      likeCount: 44,
      viewCount: 189,
      isTopPick: false,
    },
    {
      departmentName: '개발팀',
      title: '해커톤 우승팀',
      description: '24시간 해커톤에서 혁신적인 아이디어로 우승을 차지했습니다.',
      imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
      likeCount: 97,
      viewCount: 521,
      isTopPick: true,
    },
  ];

  console.log('📷 사진 생성 중...');
  for (const photo of photos) {
    await prisma.photo.create({
      data: photo,
    });
  }

  // 샘플 댓글 데이터 생성
  console.log('💬 댓글 생성 중...');
  const allPhotos = await prisma.photo.findMany();
  
  const commentTemplates = [
    { nickname: '익명의 토끼', content: '정말 멋진 순간이네요! 👏' },
    { nickname: '익명의 고양이', content: '우리 팀도 이렇게 활기차면 좋겠어요!' },
    { nickname: '익명의 펭귄', content: '분위기가 너무 좋아 보입니다 ㅎㅎ' },
    { nickname: '익명의 곰', content: '다들 열심히 하시는 모습이 보기 좋네요!' },
    { nickname: '익명의 여우', content: '👍👍👍' },
  ];

  for (const photo of allPhotos.slice(0, 5)) {
    const numComments = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numComments; i++) {
      const template = commentTemplates[Math.floor(Math.random() * commentTemplates.length)];
      await prisma.comment.create({
        data: {
          photoId: photo.id,
          nickname: template.nickname,
          content: template.content,
        },
      });
    }
  }

  console.log('✅ 시딩이 완료되었습니다!');
  console.log(`   - 부서: ${departments.length}개`);
  console.log(`   - 사진: ${photos.length}개`);
}

main()
  .catch((e) => {
    console.error('❌ 시딩 중 오류 발생:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

