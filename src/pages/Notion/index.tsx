import { useEffect, useState } from "react";
import { NotionRenderer } from "react-notion";
import { useLocation } from "react-router-dom";
import "react-notion/src/styles.css";
import styles from './Notion.module.scss';

function Notion() {
  const [ data, setData ] = useState<any>();
  const { search } = useLocation();

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    const q = new URLSearchParams(search);
    const id = q.get('id');
  
    if (!id) return;
    const postHeight = () => {
      const height = document.body.offsetHeight;
      if (height) {
        window.parent.postMessage(height, window.location.origin);
      } else {
        window.setTimeout(postHeight, 100);
      }
    }

    fetch(`https://notion-api.splitbee.io/v1/page/${id}`)
      .then(res => res.json())
      .then(res => setData(res))
      .then(postHeight)
    ;
  }, [ search ]);

  return (
    <div className={styles.root}>
      {data ? (
        <NotionRenderer
          mapPageUrl={id => `/notion?id=${id}`}
          blockMap={data}
          fullPage
        />
      ) : null}
    </div>
  );
}

export default Notion;