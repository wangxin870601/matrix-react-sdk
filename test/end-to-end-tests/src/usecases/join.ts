/*
Copyright 2018 New Vector Ltd
Copyright 2019, 2022 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { openSpotlight } from './create-room';
import { measureStart, measureStop } from '../util';
import { ElementSession } from "../session";

export async function join(session: ElementSession, roomName: string): Promise<void> {
    session.log.step(`joins room "${roomName}"`);
    await measureStart(session, "mx_JoinRoom");
    await openSpotlight(session);
    const roomInput = await session.query('.mx_SpotlightDialog_searchBox input');
    await session.replaceInputText(roomInput, roomName);

    const joinFirstLink = await session.query(
        '.mx_SpotlightDialog_content .mx_SpotlightDialog_option .mx_AccessibleButton',
    );
    await joinFirstLink.click();
    const joinRoomButton = await session.query(".mx_RoomPreviewBar_actions .mx_AccessibleButton");
    await joinRoomButton.click();
    await session.query('.mx_MessageComposer');
    await measureStop(session, "mx_JoinRoom");
    session.log.done();
}
