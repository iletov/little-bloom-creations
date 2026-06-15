import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  private supabase;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>(
      'NEXT_PUBLIC_SUPABASE_URL',
    );
    const supabaseKey = this.configService.get<string>(
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    );

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL or Key not found in environment variables.');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    // Allow internal server-to-server calls using the service role key
    const serviceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY') 
                        || this.configService.get<string>('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY');
    
    if (serviceRoleKey && token === serviceRoleKey) {
      // It's an internal admin call
      request.user = { role: 'service_role' };
      return true;
    }

    // Verify token by fetching the user
    const { data, error } = await this.supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Attach user to request so controllers can access it
    request.user = data.user;

    return true;
  }
}
