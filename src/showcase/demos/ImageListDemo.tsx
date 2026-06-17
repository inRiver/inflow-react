import { ImageList, ImageListItem } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';

const itemData = [
  { id: '1', img: 'https://picsum.photos/seed/1/150', title: 'Image 1' },
  { id: '2', img: 'https://picsum.photos/seed/2/150', title: 'Image 2' },
  { id: '3', img: 'https://picsum.photos/seed/3/150', title: 'Image 3' },
  { id: '4', img: 'https://picsum.photos/seed/4/150', title: 'Image 4' },
];

export function ImageListDemo() {
  const codeExample = `<ImageList cols={3}>
  {itemData.map((item) => (
    <ImageListItem key={item.id}>
      <img src={item.img} alt={item.title} />
    </ImageListItem>
  ))}
</ImageList>`;

  return (
    <DemoFrame title="ImageList">
      <ImageList cols={3} gap={8}>
        {itemData.map((item) => (
          <ImageListItem key={item.id}>
            <img src={item.img} alt={item.title} />
          </ImageListItem>
        ))}
      </ImageList>
      <CodeBlock code={codeExample} />
    </DemoFrame>
  );
}
