import { supabase } from './supabase/client';

/**
 * Ensures that an owner record exists for the given user
 * This is a safety measure in case the trigger or signup didn't create it
 */
export async function ensureOwnerRecord(userId: string, userEmail: string, userMetadata?: any) {
  try {
    // First, check if the owner record already exists
    const { data: existingOwner, error: checkError } = await supabase
      .from('owners')
      .select('id')
      .eq('id', userId)
      .single();

    // If owner exists, we're done
    if (existingOwner) {
      console.log('✅ Owner record already exists for user:', userId);
      return { success: true, created: false };
    }

    // If error is not "not found", throw it
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking owner record:', checkError);
      throw checkError;
    }

    // Owner doesn't exist, create it
    console.log('⚠️ Owner record missing for user:', userId, '- Creating now...');
    
    const { data: newOwner, error: createError } = await supabase
      .from('owners')
      .insert({
        id: userId,
        email: userEmail,
        full_name: userMetadata?.full_name || userEmail,
        phone: userMetadata?.phone || null,
        is_active: true,
      })
      .select()
      .single();

    if (createError) {
      // If it's a duplicate key error, that's okay - means it was just created
      if (createError.code === '23505') {
        console.log('✅ Owner record was just created by another process');
        return { success: true, created: false };
      }
      console.error('Error creating owner record:', createError);
      throw createError;
    }

    console.log('✅ Owner record created successfully:', newOwner);
    return { success: true, created: true };
    
  } catch (error) {
    console.error('Exception in ensureOwnerRecord:', error);
    throw error;
  }
}
