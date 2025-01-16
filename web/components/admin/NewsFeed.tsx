/* eslint-disable camelcase */
/* eslint-disable react/no-danger */
import React, { useState, useEffect, FC } from 'react';
import { Collapse, Typography, Skeleton } from 'antd';
import { format } from 'date-fns';

import { useTranslation } from 'next-export-i18n';
import { fetchExternalData } from '../../utils/apis';

const { Panel } = Collapse;
const { Title, Link } = Typography;

const OWNCAST_FEED_URL = 'https://owncast.online/news/index.json';
const OWNCAST_BASE_URL = 'https://owncast.online';

export type ArticleProps = {
  title: string;
  url: string;
  content_html: string;
  date_published: string;
  defaultOpen?: boolean;
};

const ArticleItem: FC<ArticleProps> = ({
  title,
  url,
  content_html: content,
  date_published: date,
  defaultOpen = false,
}) => {
  const { t } = useTranslation();
  const dateObject = new Date(date);
  const dateString = format(dateObject, 'MMM dd, yyyy, HH:mm');
  return (
    <article>
      <Collapse defaultActiveKey={defaultOpen ? url : null}>
        <Panel header={title} key={url}>
          <p className="timestamp">
            {dateString} (
            <Link href={`${OWNCAST_BASE_URL}${url}`} target="_blank" rel="noopener noreferrer">
              {t('Link')}
            </Link>
            )
          </p>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </Panel>
      </Collapse>
    </article>
  );
};

export const NewsFeed = () => {
  const { t } = useTranslation();
  const [feed, setFeed] = useState<ArticleProps[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);

  const getFeed = async () => {
    setLoading(false);

    try {
      const result = await fetchExternalData(OWNCAST_FEED_URL);
      if (result?.items.length > 0) {
        setFeed(result.items);
      }
    } catch (error) {
      console.log('==== error', error);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  const loadingSpinner = loading ? <Skeleton loading active /> : null;
  const noNews = !loading && feed.length === 0 ? <div>{t('No news.')}</div> : null;

  return (
    <section className="news-feed form-module">
      <Title level={2}>{t('News & Updates from Owncast')}</Title>
      {loadingSpinner}
      {feed.map(item => (
        <ArticleItem {...item} key={item.url} defaultOpen={feed.length === 1} />
      ))}

      {noNews}
    </section>
  );
};
