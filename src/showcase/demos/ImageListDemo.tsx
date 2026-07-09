import { useState } from 'react';
import { Box, ImageList, ImageListItem, Stack } from '@mui/material';
import { DemoFrame } from '../DemoFrame';
import { CodeBlock } from '../CodeBlock';
import { PropsPlayground } from '../PropsPlayground';
import type { PropSchema } from '../PropsPlayground';

const makeSvgTile = (bg: string, label: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'><rect width='200' height='200' rx='20' fill='${bg}'/><text x='50%' y='50%' font-family='Arial, sans-serif' font-size='22' font-weight='700' fill='#ffffff' text-anchor='middle' dominant-baseline='middle'>${label}</text></svg>`
  )}`;

const itemData = [
  { id: '1', img: makeSvgTile('#0b2d6e', 'Photo 1'), title: 'Image 1' },
  { id: '2', img: makeSvgTile('#0057cf', 'Photo 2'), title: 'Image 2' },
  { id: '3', img: makeSvgTile('#2c9b4b', 'Photo 3'), title: 'Image 3' },
  { id: '4', img: makeSvgTile('#ff6424', 'Photo 4'), title: 'Image 4' },
];

export function ImageListDemo() {
  const [props, setProps] = useState<Record<string, any>>({
    variant: 'standard',
    cols: '3',
  });

  const schema: PropSchema[] = [
    {
      name: 'variant',
      type: 'select',
      options: ['standard', 'quilted', 'masonry', 'woven'],
    },
    {
      name: 'cols',
      type: 'select',
      options: ['1', '2', '3', '4'],
    },
  ];

  const codeExample = `
import { ImageList, ImageListItem } from '@mui/material';

<ImageList variant={props.variant} cols={Number(props.cols)}>
  {itemData.map((item) => (
    <ImageListItem key={item.id}>
      <img src={item.img} alt={item.title} />
    </ImageListItem>
  ))}
</ImageList>`;

  return (
    <>
      <DemoFrame title="Image List - Interactive">
        <Box sx={{ width: 520, maxWidth: '100%' }}>
          <ImageList variant={props.variant} cols={Number(props.cols)} gap={8} sx={{ maxHeight: 420 }}>
            {itemData.map((item, index) => (
              <ImageListItem
                key={item.id}
                cols={props.variant === 'quilted' && index === 0 ? 2 : 1}
                rows={props.variant === 'quilted' && index === 0 ? 2 : 1}
              >
                <img src={item.img} alt={item.title} loading="lazy" />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      </DemoFrame>

      <PropsPlayground schema={schema} values={props} onChange={setProps} />

      <CodeBlock code={codeExample} language="tsx" />

      <DemoFrame title="All States">
        <Stack spacing={2} direction="column">
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Box sx={{ width: 220 }}>
              <ImageList cols={2} gap={8}>
                {itemData.map((item) => (
                  <ImageListItem key={`standard-${item.id}`}>
                    <img src={item.img} alt={item.title} loading="lazy" />
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
            <Box sx={{ width: 220 }}>
              <ImageList variant="quilted" cols={2} gap={8}>
                {itemData.map((item, index) => (
                  <ImageListItem
                    key={`quilted-${item.id}`}
                    cols={index === 0 ? 2 : 1}
                    rows={index === 0 ? 2 : 1}
                  >
                    <img src={item.img} alt={item.title} loading="lazy" />
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
            <Box sx={{ width: 220 }}>
              <ImageList variant="woven" cols={2} gap={8}>
                {itemData.map((item) => (
                  <ImageListItem key={`woven-${item.id}`}>
                    <img src={item.img} alt={item.title} loading="lazy" />
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
            <Box sx={{ width: 220, height: 260, overflowY: 'auto' }}>
              <ImageList variant="masonry" cols={2} gap={8}>
                {itemData.map((item) => (
                  <ImageListItem key={`masonry-${item.id}`}>
                    <img src={item.img} alt={item.title} loading="lazy" />
                  </ImageListItem>
                ))}
              </ImageList>
            </Box>
          </Stack>
        </Stack>
      </DemoFrame>
    </>
  );
}
