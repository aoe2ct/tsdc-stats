---
title: T90 Sudden Death Cup in Stats
description: Statistics for the Sudden Death Cup Age of Empires II tournament hosted by T90Official
image: /img/tsdc.webp
---

import Chart from '../components/charts/chart.tsx'
import Base from '../components/charts/base.tsx'
import FilterDialog from '../components/filter/filter-dialog.tsx'
import BrowserOnly from '@docusaurus/BrowserOnly';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from '../components/charts/base.module.css';

<div style={{ display: "flex", justifyContent: 'center', marginBottom: '2em' }}>
    <img alt="T90 Sudden Death Cup" src={useBaseUrl("/img/tsdc.webp")} width="350" height="385"/>
</div>
# T90 Sudden Death Cup in Stats

<sup className={styles.attributions}>Thanks to Beargwyn for compiling all the data.</sup>
<sup className={styles.attributions}>Thanks to Salytmacska for creating the original website.</sup>

Welcome to the "T90 Sudden Death Cup in Stats" website. This website collects all the statistics you could ever want to know about the tournament in one place!

The data, by default summarizes the entire tournament (as of 2025.11.26). Use the filters on the toolbar to view the data pertaining to a particular map or bracket.
<!--
This is a very quick fix to get the build on server to work. This likely kills indexing of the page, so if I care in the future, then fix this properly
-->
<BrowserOnly>{() => <Base/>}</BrowserOnly>

<FilterDialog/>
