import { Api } from 'grammy';
import { SupabaseClient } from '@supabase/supabase-js';

export interface NotificationPayload {
    telegramId: number;
    message: string;
    type: 'project_created' | 'subtask_assigned' | 'subtask_updated' | 'message_received';
    metadata?: {
        projectId?: number;
        subtaskId?: number;
        fromUserId?: string;
    };
}

/**
 * Send push notification to a Telegram user
 */
export async function sendNotification(
    botApi: Api,
    payload: NotificationPayload
): Promise<boolean> {
    try {
        const { telegramId, message, type, metadata } = payload;

        // Send notification without emojis
        await botApi.sendMessage(telegramId, message, {
            parse_mode: 'Markdown',
            reply_markup: metadata?.projectId ? {
                inline_keyboard: [
                    [
                        {
                            text: 'View in App',
                            web_app: {
                                url: `${process.env.TELEGRAM_MINI_APP_URL}/projects/${metadata.projectId}`
                            }
                        }
                    ]
                ]
            } : undefined
        });

        return true;
    } catch (error) {
        console.error('Failed to send notification:', error);
        return false;
    }
}

/**
 * Notify admin when a new project is created
 */
export async function notifyProjectCreated(
    botApi: Api,
    supabase: SupabaseClient,
    projectId: number,
    projectName: string,
    creatorUserId: string
) {
    try {
        // Get all admin users
        const { data: admins } = await supabase
            .from('telegram_users')
            .select('telegram_id')
            .eq('role', 'admin')
            .neq('user_id', creatorUserId); // Don't notify the creator

        if (!admins || admins.length === 0) return;

        const message = `*New Project Created*\n\n${projectName}\n\nProject ID: ${projectId}`;

        for (const admin of admins) {
            await sendNotification(botApi, {
                telegramId: admin.telegram_id,
                message,
                type: 'project_created',
                metadata: { projectId }
            });
        }
    } catch (error) {
        console.error('Error notifying project creation:', error);
    }
}

/**
 * Notify assignee when a subtask is assigned to them
 */
export async function notifySubtaskAssigned(
    botApi: Api,
    supabase: SupabaseClient,
    subtaskId: number,
    subtaskTitle: string,
    assignedToUserId: string,
    projectId: number
) {
    try {
        // Get assignee's Telegram ID
        const { data: telegramUser } = await supabase
            .from('telegram_users')
            .select('telegram_id')
            .eq('user_id', assignedToUserId)
            .single();

        if (!telegramUser) return;

        const message = `*New Task Assigned*\n\n${subtaskTitle}\n\nYou have been assigned a new task!`;

        await sendNotification(botApi, {
            telegramId: telegramUser.telegram_id,
            message,
            type: 'subtask_assigned',
            metadata: { subtaskId, projectId }
        });
    } catch (error) {
        console.error('Error notifying subtask assignment:', error);
    }
}

/**
 * Notify admin when a subtask status is updated
 */
export async function notifySubtaskUpdated(
    botApi: Api,
    supabase: SupabaseClient,
    subtaskId: number,
    subtaskTitle: string,
    newStatus: string,
    projectOwnerId: string,
    projectId: number
) {
    try {
        // Get project owner's Telegram ID
        const { data: telegramUser } = await supabase
            .from('telegram_users')
            .select('telegram_id')
            .eq('user_id', projectOwnerId)
            .single();

        if (!telegramUser) return;

        const message = `*Task Status Updated*\n\n${subtaskTitle}\n\nNew status: *${newStatus}*`;

        await sendNotification(botApi, {
            telegramId: telegramUser.telegram_id,
            message,
            type: 'subtask_updated',
            metadata: { subtaskId, projectId }
        });
    } catch (error) {
        console.error('Error notifying subtask update:', error);
    }
}

/**
 * Notify user when they receive a message
 */
export async function notifyMessageReceived(
    botApi: Api,
    supabase: SupabaseClient,
    toUserId: string,
    fromUserName: string,
    messagePreview: string,
    projectId?: number
) {
    try {
        // Get recipient's Telegram ID
        const { data: telegramUser } = await supabase
            .from('telegram_users')
            .select('telegram_id')
            .eq('user_id', toUserId)
            .single();

        if (!telegramUser) return;

        const preview = messagePreview.length > 50
            ? messagePreview.substring(0, 50) + '...'
            : messagePreview;

        const message = `*New Message from ${fromUserName}*\n\n"${preview}"`;

        await sendNotification(botApi, {
            telegramId: telegramUser.telegram_id,
            message,
            type: 'message_received',
            metadata: { projectId }
        });
    } catch (error) {
        console.error('Error notifying message received:', error);
    }
}
