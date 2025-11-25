---
title: T90 Sudden Death Cup in Stats
---

import Players from '../components/charts/players.tsx'
import FilterDialog from '../components/filter/filter-dialog.tsx'
import BrowserOnly from '@docusaurus/BrowserOnly';

# Individual player stats

<!--
This is a very quick fix to get the build on server to work. This likely kills indexing of the page, so if I care in the future, then fix this properly
-->
<BrowserOnly>{() => <Players/>}</BrowserOnly>

<FilterDialog/>
