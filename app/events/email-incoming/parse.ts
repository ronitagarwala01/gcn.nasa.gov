/*!
 * Copyright © 2022 United States Government as represented by the Administrator
 * of the National Aeronautics and Space Administration. No copyright is claimed
 * in the United States under Title 17, U.S. Code. All Other Rights Reserved.
 *
 * SPDX-License-Identifier: NASA-1.3
 */
import type { AddressObject } from 'mailparser'
import addressparser from 'nodemailer/lib/addressparser'

const legacyAddress = 'mailnull@capella2.gsfc.nasa.gov'
const legacyFromNameSuffix = ' via gcncirc'

/**
 * Parse rewritten From addresses from capella2.
 *
 * Messages forwarded by capella2 from non-NASA addresses have From headers
 * that are rewritten like this:
 *
 * From: Albert Einstein <albert.einstein@ligo.org>
 * --rewritten to--
 * From: "Albert Einstein <albert.einstein@ligo.org> via gcncirc" <mailnull@capella2.gsfc.nasa.gov>
 *
 */
export function getFromAddress(fromAddressObject?: AddressObject) {
  let from = fromAddressObject?.value[0]
  if (
    from?.address === legacyAddress &&
    from.name.endsWith(legacyFromNameSuffix)
  ) {
    from = addressparser(from.name.slice(0, -legacyFromNameSuffix.length), {
      flatten: true,
    })[0]
  }
  const address = from?.address
  if (!address) throw new Error('From address is missing')
  return address
}

export function getReplyToAddresses(replyTo?: AddressObject) {
  const result = replyTo?.value
    .map(({ address }) => address)
    .filter(Boolean) as string[] | undefined
  return result?.length ? result : undefined
}
