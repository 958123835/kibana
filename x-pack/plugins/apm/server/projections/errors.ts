/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { Setup, SetupTimeRange } from '../../server/lib/helpers/setup_request';
import {
  SERVICE_NAME,
  ERROR_GROUP_ID,
} from '../../common/elasticsearch_fieldnames';
import { environmentQuery, rangeQuery } from '../../common/utils/queries';
import { ProcessorEvent } from '../../common/processor_event';

export function getErrorGroupsProjection({
  environment,
  setup,
  serviceName,
}: {
  environment?: string;
  setup: Setup & SetupTimeRange;
  serviceName: string;
}) {
  const { start, end, esFilter } = setup;

  return {
    apm: {
      events: [ProcessorEvent.error as const],
    },
    body: {
      query: {
        bool: {
          filter: [
            { term: { [SERVICE_NAME]: serviceName } },
            ...rangeQuery(start, end),
            ...environmentQuery(environment),
            ...esFilter,
          ],
        },
      },
      aggs: {
        error_groups: {
          terms: {
            field: ERROR_GROUP_ID,
          },
        },
      },
    },
  };
}
