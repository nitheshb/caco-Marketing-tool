import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getAuthUser } from '@/lib/auth-helpers';
import { generateStrategyPosts } from '@/lib/strategy-gemini';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await getAuthUser(req);
        if (!userId) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const {
            businessType,
            brandName,
            targetAudience,
            goal,
            platforms,
            theme,
            durationDays,
            startDate,
        } = body;

        if (!brandName || !platforms?.length || !durationDays || !startDate) {
            return NextResponse.json(
                { error: 'Brand name, platforms, duration, and start date are required' },
                { status: 400 }
            );
        }

        const posts = await generateStrategyPosts({
            businessType: businessType || 'Other',
            brandName: String(brandName).trim(),
            targetAudience: targetAudience || '',
            goal: goal || 'brand_awareness',
            platforms: Array.isArray(platforms) ? platforms : [],
            theme: theme || undefined,
            durationDays: Number(durationDays) || 30,
        });

        const strategyName = theme
            ? `${String(brandName).trim()} – ${String(theme).trim()}`
            : String(brandName).trim();

        const { data: strategy, error: strategyError } = await supabaseAdmin
            .from('strategies')
            .insert({
                user_id: userId,
                name: strategyName,
                business_type: businessType || null,
                brand_name: String(brandName).trim(),
                target_audience: targetAudience || null,
                goal: goal || null,
                platforms: platforms || [],
                theme: theme || null,
                duration_days: Number(durationDays) || 30,
                start_date: startDate,
            })
            .select()
            .single();

        if (strategyError) {
            console.error('[STRATEGY_GENERATE]', strategyError);
            return NextResponse.json({ error: strategyError.message }, { status: 500 });
        }

        const postsToInsert = posts.map((p) => ({
            strategy_id: strategy.id,
            day: p.day,
            platform: p.platform,
            content_type: p.content_type,
            theme: p.theme,
            idea: p.idea,
            caption: p.caption,
            goal: p.goal,
            status: p.status,
            include_in_calendar: true,
        }));

        const { data: insertedPosts, error: postsError } = await supabaseAdmin
            .from('strategy_posts')
            .insert(postsToInsert)
            .select();

        if (postsError) {
            await supabaseAdmin.from('strategies').delete().eq('id', strategy.id);
            console.error('[STRATEGY_GENERATE]', postsError);
            return NextResponse.json({ error: postsError.message }, { status: 500 });
        }

        return NextResponse.json(
            { strategy: { ...strategy, posts: insertedPosts } },
            { status: 201 }
        );
    } catch (error) {
        console.error('[STRATEGY_GENERATE]', error);
        const message = error instanceof Error ? error.message : 'Failed to generate strategy';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
